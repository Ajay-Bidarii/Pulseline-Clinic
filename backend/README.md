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

## Setup

```bash
npm install
cp .env.example .env   # then fill in DATABASE_URL and the JWT/cookie secrets
npx prisma migrate dev --name init
npm run prisma:seed    # optional: creates admin@pulseline.clinic + 6 doctors, password123
npm run dev
```

The API listens on `http://localhost:5000` by default, with everything
mounted under `/api/v1` (e.g. `POST /api/v1/auth/login`,
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

  Two bugs flagged during review of the original module spec — a
  `filters`/`filter` parameter-name mismatch in the list query, and an
  `updataData` typo in the update path — are both avoided here by using one
  consistent parameter name throughout `payment.service.js`; neither pattern
  appears in this file.

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
