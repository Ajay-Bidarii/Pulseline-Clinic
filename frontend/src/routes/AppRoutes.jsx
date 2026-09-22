import { Navigate, Route, Routes } from "react-router-dom";
import { MainLayout, AuthLayout, VisitorLayout, PatientLayout, DoctorLayout } from "../components/layout";
import {
  DashboardPage,
  AppointmentsPage,
  PatientsPage,
  DoctorsPage,
  QueuePage,
  BillingPage,
  SettingsPage,
  LoginPage,
  VisitorPage,
  AboutPage,
  ServicesPage,
  ServiceDetailPage,
  ContactPage,
  DoctorDetailPage,
  QueueDisplayPage,
  PatientLoginPage,
  PatientRegisterPage,
  PatientPortalPage,
  DoctorLoginPage,
  DoctorPortalPage,
} from "../pages";
import { useAuth } from "../hooks/useAuth";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { ROUTES, ROLES } from "../utils/constants";

const HOME_BY_ROLE = {
  [ROLES.STAFF]: ROUTES.DASHBOARD,
  [ROLES.DOCTOR]: ROUTES.DOCTOR_PORTAL,
  [ROLES.PATIENT]: ROUTES.PATIENT_PORTAL,
};

const LOGIN_BY_ROLE = {
  [ROLES.STAFF]: ROUTES.LOGIN,
  [ROLES.DOCTOR]: ROUTES.DOCTOR_LOGIN,
  [ROLES.PATIENT]: ROUTES.PATIENT_LOGIN,
};

/** Requires a signed-in user with a specific role; otherwise redirects to that role's sign-in. */
function RequireRole({ role, children }) {
  const { isAuthenticated, role: currentRole, initializing } = useAuth();
  if (initializing) return <LoadingSpinner full label="Checking your session" />;
  if (!isAuthenticated || currentRole !== role) {
    return <Navigate to={LOGIN_BY_ROLE[role]} replace />;
  }
  return children;
}

/** Keeps signed-in users off auth pages meant for guests, sending them to their own home. */
function GuestOnly({ role, children }) {
  const { isAuthenticated, role: currentRole, initializing } = useAuth();
  if (initializing) return <LoadingSpinner full label="Loading" />;
  if (isAuthenticated && currentRole === role) {
    return <Navigate to={HOME_BY_ROLE[role]} replace />;
  }
  return children;
}

export function AppRoutes() {
  return (
    <Routes>
      {/* Public visitor area — no login required */}
      <Route element={<VisitorLayout />}>
        <Route path={ROUTES.HOME} element={<VisitorPage />} />
        <Route path={ROUTES.ABOUT} element={<AboutPage />} />
        <Route path={ROUTES.SERVICES} element={<ServicesPage />} />
        <Route path={ROUTES.SERVICE_DETAIL} element={<ServiceDetailPage />} />
        <Route path={ROUTES.CONTACT} element={<ContactPage />} />
        <Route path={ROUTES.DOCTOR_DETAIL} element={<DoctorDetailPage />} />
      </Route>

      {/* Public waiting-room monitor screen — no chrome, meant for a lobby display */}
      <Route path={ROUTES.QUEUE_DISPLAY} element={<QueueDisplayPage />} />

      {/* Staff auth */}
      <Route
        element={
          <GuestOnly role={ROLES.STAFF}>
            <AuthLayout />
          </GuestOnly>
        }
      >
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      </Route>

      {/* Doctor auth */}
      <Route
        element={
          <GuestOnly role={ROLES.DOCTOR}>
            <AuthLayout />
          </GuestOnly>
        }
      >
        <Route path={ROUTES.DOCTOR_LOGIN} element={<DoctorLoginPage />} />
      </Route>

      {/* Patient auth */}
      <Route
        element={
          <GuestOnly role={ROLES.PATIENT}>
            <AuthLayout />
          </GuestOnly>
        }
      >
        <Route path={ROUTES.PATIENT_LOGIN} element={<PatientLoginPage />} />
        <Route path={ROUTES.PATIENT_REGISTER} element={<PatientRegisterPage />} />
      </Route>

      {/* Staff admin area */}
      <Route
        element={
          <RequireRole role={ROLES.STAFF}>
            <MainLayout />
          </RequireRole>
        }
      >
        <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
        <Route path={ROUTES.APPOINTMENTS} element={<AppointmentsPage />} />
        <Route path={ROUTES.PATIENTS} element={<PatientsPage />} />
        <Route path={ROUTES.DOCTORS} element={<DoctorsPage />} />
        <Route path={ROUTES.QUEUE} element={<QueuePage />} />
        <Route path={ROUTES.BILLING} element={<BillingPage />} />
        <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
      </Route>

      {/* Doctor portal */}
      <Route
        element={
          <RequireRole role={ROLES.DOCTOR}>
            <DoctorLayout />
          </RequireRole>
        }
      >
        <Route path={ROUTES.DOCTOR_PORTAL} element={<DoctorPortalPage />} />
      </Route>

      {/* Patient portal */}
      <Route
        element={
          <RequireRole role={ROLES.PATIENT}>
            <PatientLayout />
          </RequireRole>
        }
      >
        <Route path={ROUTES.PATIENT_PORTAL} element={<PatientPortalPage />} />
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
}
