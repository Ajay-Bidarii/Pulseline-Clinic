export const APP_NAME = import.meta.env.VITE_APP_NAME || "Pulseline Clinic";

export const APPOINTMENT_STATUS = {
  CONFIRMED: "confirmed",
  PENDING: "pending",
  CANCELLED: "cancelled",
  COMPLETED: "completed",
};

export const APPOINTMENT_STATUS_LABELS = {
  [APPOINTMENT_STATUS.CONFIRMED]: "Confirmed",
  [APPOINTMENT_STATUS.PENDING]: "Awaiting confirmation",
  [APPOINTMENT_STATUS.CANCELLED]: "Cancelled",
  [APPOINTMENT_STATUS.COMPLETED]: "Completed",
};

export const DEPARTMENTS = [
  "General Medicine",
  "Pediatrics",
  "Cardiology",
  "Orthopedics",
  "Dermatology",
  "Gynecology",
  "ENT",
  "Neurology",
];

export const ROLES = {
  STAFF: "staff",
  DOCTOR: "doctor",
  PATIENT: "patient",
};

export const QUEUE_STATUS = {
  WAITING: "waiting",
  IN_CONSULT: "in-consult",
  DONE: "done",
};

export const INVOICE_STATUS = {
  PENDING: "pending",
  PAID: "paid",
};

export const PAYMENT_METHODS = {
  ESEWA: "esewa",
  KHALTI: "khalti",
  CASH: "cash",
};

export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  SERVICES: "/services",
  SERVICE_DETAIL: "/services/:slug",
  CONTACT: "/contact",
  DOCTOR_DETAIL: "/doctors/:id",
  QUEUE_DISPLAY: "/queue-display",

  DASHBOARD: "/admin",
  APPOINTMENTS: "/admin/appointments",
  PATIENTS: "/admin/patients",
  DOCTORS: "/admin/doctors",
  QUEUE: "/admin/queue",
  BILLING: "/admin/billing",
  SETTINGS: "/admin/settings",
  LOGIN: "/staff/login",

  DOCTOR_LOGIN: "/doctor/login",
  DOCTOR_PORTAL: "/doctor/portal",

  PATIENT_LOGIN: "/patient/login",
  PATIENT_REGISTER: "/patient/register",
  PATIENT_PORTAL: "/portal",
};

export function serviceDetailPath(slug) {
  return `/services/${slug}`;
}

export function doctorDetailPath(id) {
  return `/doctors/${id}`;
}
