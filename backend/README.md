# Pulseline Clinic — Backend

Express + Prisma (MySQL) + Socket.IO API matching the architecture in the
project guide, structured to plug into the `clinic-frontend` app.

## ⚠️ Before you run this

This code is a **structural scaffold** — it will not start successfully
until you provide a real MySQL database and fill in `.env`. Specifically:

1. **A running MySQL instance** and a `DATABASE_URL` in `.env` pointing to it.
2. **Network access to `binaries.prisma.sh`** the first time you run
   `npx prisma generate` or `npm install` — Prisma downloads a query engine
   binary. This works on any normal machine; it just won't work behind a
   fully locked-down firewall/proxy.
3. Real values for `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, and
   `COOKIE_SECRET` (any long random string works for local dev).
4. If you want emails (OTP) to actually send: SMTP credentials. Otherwise the
   app logs "would send" messages to the console and keeps working.
5. If you want real payments: eSewa merchant credentials and/or a Khalti
   secret key. Without them, `billing.controller.js`'s eSewa/Khalti routes
   will run but fail their signature/API calls — the frontend's mock
   `billingService.js` is what actually powers the demo today.

## Deploying to Render

See the root `render.yaml` for a one-click Blueprint deploy, or configure
manually:

- **Database**: Render's managed PostgreSQL (not MySQL — Render has no
  managed MySQL, so `prisma/schema.prisma` targets `postgresql`. If you'd
  rather keep MySQL, use an external host — PlanetScale, Railway, Aiven —
  and change the datasource `provider` back to `"mysql"`; nothing else in
  the schema is MySQL/Postgres-specific).
- **Build Command**: `npm install && npm run build` (runs `prisma generate`
  and `prisma migrate deploy`)
- **Start Command**: `npm start`
- **Health Check Path**: `/health`
- **Environment variables**: `DATABASE_URL` (from the Render Postgres
  instance), `CLIENT_URL` (your deployed frontend's URL — comma-separate
  more than one origin), `JWT_ACCESS_SECRET`/`JWT_REFRESH_SECRET`/
  `COOKIE_SECRET` (long random strings — Render can generate these for you),
  plus `CLOUDINARY_*` if you're using file uploads.

Three things this project's code already accounts for so deployment isn't
silently broken:
- `app.set("trust proxy", 1)` — Render terminates TLS at a proxy in front of
  the app; without this, secure cookies and rate-limit IP detection misread
  every request as insecure.
- The refresh-token cookie uses `SameSite=None; Secure` in production
  (`utils/cookie.js`) — frontend and backend live on different Render
  subdomains, and `SameSite=Lax` would silently drop the cookie cross-site.
- `config/multer.js` writes temp upload files to `os.tmpdir()` rather than a
  relative project path, which is safer across hosts.

## Setup

```bash
npm install
cp .env.example .env   # then fill in DATABASE_URL and the JWT/cookie secrets
npx prisma migrate dev --name init
npm run prisma:seed    # optional: creates admin@pulseline.clinic + 6 doctors, password123
npm run dev
```

The API listens on `http://localhost:5000` by default, and Socket.IO runs on
that same port (see `config/socket.js`). Everything is mounted under `/api/v1` (e.g. `POST /api/v1/auth/login`,
`GET /api/v1/billing/summary`, `GET /api/v1/medical-records/patient/:id/history`,
`POST /api/v1/payments`)
— every module shares this one versioned prefix rather than each having its
own bare `/api/...` root.

## What's implemented for real (not just stubbed)

- **Auth** (`module/auth`): register, login, refresh-token rotation via an
  httpOnly signed cookie, logout, `GET /me`, and OTP issue/verify email flows
  — all backed by Prisma + bcrypt + JWT.
- **Patients / Doctors / Departments**: full CRUD services and routes,
  role-gated with `requireAuth` + `requireRole`.
- **Appointments**: booking with a same-doctor/same-slot conflict check,
  status transitions, and a doctor-only "add prescription" endpoint that
  also marks the visit completed.
- **Queue** (`module/queue`): check-in, call-next (auto-completes the
  doctor's current patient and pulls the next waiting one), and every
  mutation emits a `queue:updated` Socket.IO event — this is what a real
  waiting-room display or dashboard would subscribe to instead of polling.
- **Billing** (`module/billing`): itemized `Bill` + `Payment` CRUD —
  auto-recalculates `subtotal`/`totalAmount` from line items server-side,
  blocks editing or deleting a bill once it's `PAID`/`REFUNDED`, only lets
  `UNPAID` bills be cancelled, and exposes an admin `/summary` analytics
  endpoint (revenue collected, outstanding total, counts by status). Payment
  is logged as its own `Payment` row (pending → success/failed) with
  transaction ID and gateway reference, wired to real gateway code:
  - `gateways/esewa.js` builds and verifies the HMAC-SHA256 signed payload
    for eSewa's ePay v2 flow.
  - `gateways/khalti.js` calls Khalti's `epayment/initiate` and
    `epayment/lookup` endpoints for server-side verification.
  These will work as soon as real merchant credentials are in `.env` — they
  are not implemented against a mock. A `CASH` method is also supported and
  marks the bill paid immediately (for in-person payment at the front desk).
- **Medical Records** (`module/medicalRecord`): a `MedicalRecord` per
  diagnosis (optionally tied to an appointment), with nested `Prescription`
  and `Report` (lab/diagnostic file) rows. `GET /patient/:patientId/history`
  returns a patient's full diagnostic history newest-first — this is what a
  doctor's or patient's "medical history" view would call.
- **Payments** (`module/payments`): records a payment against a `Bill`,
  automatically moving the bill to `PARTIALLY_PAID` or `PAID` depending on
  how much of the total is now covered, blocks paying a `CANCELLED` or
  already-`PAID` bill, blocks a payment that would exceed the remaining
  balance, and writes an `AuditLog` entry for every create/update/refund.
  Also handles full or partial refunds (moves the bill back to
  `PARTIALLY_PAID` or `REFUNDED` accordingly) and per-patient payment
  history. A patient calling `GET /payments/history/:patientId` can only
  ever fetch their own — enforced in the controller, not just by role.

- **Dashboard & Analytics** (`module/dashboard`): `GET /statistics` (admin),
  `/daily-summary` (admin + receptionist), `/revenue` (admin), `/doctor-load`
  (admin + receptionist). All support flexible date ranges
  (`?range=today|week|month|year` or `range=custom&startDate=&endDate=`) and
  use Prisma `aggregate`/`groupBy`/`count` rather than loading tables into
  memory.
- **File uploads** (`config/cloudinary.js`, `config/multer.js`,
  `middleware/multerMiddleware.js`): multer writes to `uploads/temp`, the
  Cloudinary helper uploads from there and always deletes the temp file
  afterwards. Wired into four places — user avatars
  (`POST /auth/profile/avatar`, `PUT /auth/profile`, 5MB, images only),
  patient documents (`POST /patients`, `PUT /patients/:id`, up to 5 files),
  doctor profile pictures + certificates (`POST /doctors`, `PUT /doctors/:id`),
  and medical report files (`POST /medical-records/report`,
  `PUT|DELETE /medical-records/report/:id`). Replacing or deleting a file
  destroys the old Cloudinary asset, so nothing is orphaned. Upload errors
  (size, count, wrong type) return normal API errors instead of crashing.
- **Socket.IO real-time engine** (`config/socket.js`): JWT-authenticated
  connections, role rooms (`ADMIN-<userId>`), entity rooms
  (`patient-<patientId>`, `doctor-<doctorId>`), a shared `staff` room, plus
  online/offline `userStatusChanged` broadcasts and `bookAppointment` /
  `updateAppointment` / `cancelAppointment` handlers.

  One deliberate deviation from the spec: sockets presenting **no** token
  connect as anonymous guests rather than being rejected. This is what lets
  the public waiting-room display page receive live queue updates without a
  login. Guests never join a role or entity room and cannot emit domain
  events, so it isn't an authorization bypass.

  REST controllers emit through `utils/realtime.js` rather than calling
  `io.emit()` directly. A bare `io.emit()` broadcasts to every connected
  socket, which would have shown one patient another patient's appointment
  events; the helpers address each event to the doctor room, patient room,
  staff room, and — for queue changes — the public `display` room. They also
  reuse the same event names `config/socket.js` emits, so a client
  subscribes once whether a change came from a REST call or a socket message.

  All multipart routes validate after multer parses the body, using
  coercing Zod schemas (`createPatientSchema`, `createDoctorSchema`,
  `createReportMultipartSchema`) — form-data fields always arrive as strings,
  so numbers and dates need coercion rather than strict typing.

  Bugs flagged during review of the original module specs — a
  `filters`/`filter` parameter-name mismatch in the list query, and an
  `updataData` typo in the update path — are both avoided here by using one
  consistent parameter name throughout `payment.service.js`; neither pattern
  appears in this file. The same applies to the socket module: the `Server`
  import is correctly capitalized, `verifyAccessToken` is imported, there is
  no `brodcast` typo, no `new server(server, ...)` shadowing, and every
  `socket.on` lives inside the connection handler rather than at module
  scope. `server.js` creates an explicit `http.createServer(app)` and passes
  it to `initializeSocket()` — using `app.listen()` alone would leave the
  WebSocket upgrade unhandled.

## What's intentionally left as a thin layer

Input validation uses `zod` schemas per module (see any `*.schema.js`).
File uploads (`config/multer.js`) are configured but no route currently uses
them — wire up a doctor-document or avatar-upload route if you need one.
There's no automated test suite yet.

## Connecting the frontend

In `clinic-frontend/.env`, set:

```
VITE_USE_MOCK_API=false
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

Every function in the frontend's `src/services/*.js` already has the real
`fetch` call written next to its mock path, so no frontend code changes are
needed beyond that — though a few response-shape mismatches are likely
until both sides are tested against each other (e.g. the mock queue uses
`patientName`/`doctorName` strings directly, while this backend returns
nested `patient.user.fullName` — the frontend would need small mapping
tweaks to consume real API responses).
