# Pulseline — Clinic Management System (Frontend)

A React + Vite + Tailwind CSS frontend for managing a clinic's appointments,
patients, and doctors, with a mock API layer so it runs fully standalone.

## Stack

- React 18 + React Router 6
- Vite 5
- Tailwind CSS 3
- lucide-react icons
- Mock service layer (swap to a real API by editing `.env`)

## Deploying to Render

Create a Render **Static Site** (or use the root `render.yaml` Blueprint):

- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`
- **Environment variables** (set before building — Vite bakes `VITE_*` vars
  into the build, they can't be changed at runtime after):
  `VITE_USE_MOCK_API=false`, `VITE_API_BASE_URL=https://<your-backend>.onrender.com/api/v1`
- `public/_redirects` (copied into `dist` automatically) sends every path to
  `index.html` — without it, refreshing any non-root route like `/portal`
  would 404 on a static host, since React Router's client-side routing only
  works once `index.html` has actually loaded.

## Getting started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

- **Visitors** land on the public home page (`/`) — browse doctors and request an
  appointment with no account needed.
- **Patients** can create an account (`/patient/register`) or sign in
  (`/patient/login`) with a seeded patient email (e.g. `elena.marsh@mail.com`)
  and any password of 4+ characters, to see their own appointments in the portal.
- **Staff/admin** accounts are fixed, not self-service. Sign in at
  `/staff/login` with `admin@pulseline.clinic` (or `priya.basnet@pulseline.clinic`,
  `rohan.gurung@pulseline.clinic`) and any password of 4+ characters. The full
  list of staff accounts lives in `src/services/mockData.js` (`mockStaff`).

## Real-time updates

The queue pages (`/admin/queue` and the public `/queue-display` screen) use
`src/hooks/useLiveQueue.js`. With a real backend connected they receive
pushed `queue:updated` events over Socket.IO; in mock mode, where there is no
server, the same hook falls back to polling so the standalone demo still
updates. `src/services/socketClient.js` holds the connection and stays
dormant while `VITE_USE_MOCK_API=true`.

## Connecting a real backend

Set `VITE_USE_MOCK_API=false` in `.env` (`VITE_API_BASE_URL` already points at
`http://localhost:5000/api/v1`, the backend's default). `src/config/api.js` is
the HTTP client used in that mode. Every function in `src/services/*.js` already has the real
`fetch` call written alongside its mock path — no other code changes needed.

## Project structure

See the folder tree in the project root. Key directories:

- `src/components/common` — reusable UI primitives (Button, Card, Input, Modal, Toast, etc.)
- `src/components/layout` — `MainLayout` (sidebar + topbar) and `AuthLayout`
- `src/components/features` — domain components grouped by feature area
- `src/pages` — route-level pages
- `src/context` — `AuthContext` and `ToastContext`
- `src/services` — API/service layer with mock data
- `src/routes` — route configuration with protected/guest routes

## Design notes

The visual identity uses a clinical teal palette (`clinic-*` in
`tailwind.config.js`) with coral and amber accents reserved for warnings and
alerts. An ECG "pulse-line" motif recurs as the signature element — in the
logo, the loading spinner, and the auth screen backdrop — tying the visual
language back to the subject matter.
