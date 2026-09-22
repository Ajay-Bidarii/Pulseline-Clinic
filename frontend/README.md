# Pulseline Clinic — Full Project

Two independent projects:

- **clinic-frontend/** — React + Vite + Tailwind app. Runs standalone with
  mock data (`npm install && npm run dev`). Covers visitor, patient, doctor,
  and staff/admin experiences. See `clinic-frontend/README.md`.
- **clinic-backend/** — Express + Prisma (MySQL) + Socket.IO API scaffold
  matching the frontend's data shape and roles, including Medical Records,
  Billing & Invoicing, and Payments modules (see `clinic-backend/README.md`
  for what's fully implemented vs. what needs real credentials).

The frontend works completely on its own today (mock API layer). Point it at
the backend by setting `VITE_USE_MOCK_API=false` in `clinic-frontend/.env`
once the backend is running against a real databases.
