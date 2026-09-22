import { Link, NavLink, Outlet } from "react-router-dom";
import { APP_NAME, ROUTES } from "../../utils/constants";
import { Button } from "../common/Button";
import { classNames } from "../../utils/formatters";

const navLinks = [
  { to: ROUTES.HOME, label: "Home", end: true },
  { to: ROUTES.ABOUT, label: "About" },
  { to: ROUTES.SERVICES, label: "Services" },
  { to: ROUTES.CONTACT, label: "Contact" },
];

function PulseLogo() {
  return (
    <Link to={ROUTES.HOME} className="flex items-center gap-2.5">
      <svg width="30" height="30" viewBox="0 0 64 64" className="shrink-0">
        <rect width="64" height="64" rx="16" fill="#146356" />
        <path
          d="M6 34h9l4-14 8 26 6-18 4 6h21"
          fill="none"
          stroke="#DEEEE6"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="font-display font-semibold text-ink-900 text-[15px] tracking-tight">
        {APP_NAME}
      </span>
    </Link>
  );
}

export function VisitorLayout() {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <header className="border-b border-ink-100 bg-surface-raised sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
          <PulseLogo />
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  classNames(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive ? "text-clinic-700 bg-clinic-50" : "text-ink-500 hover:text-clinic-700"
                  )
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            <Link to={ROUTES.PATIENT_LOGIN}>
              <Button variant="ghost" size="sm">
                Patient
              </Button>
            </Link>
            <Link to={ROUTES.DOCTOR_LOGIN}>
              <Button variant="ghost" size="sm">
                Doctor
              </Button>
            </Link>
            <Link to={ROUTES.LOGIN}>
              <Button variant="outline" size="sm">
                Staff sign in
              </Button>
            </Link>
          </div>
        </div>
        <nav className="md:hidden flex items-center gap-1 px-4 pb-3 overflow-x-auto">
          {navLinks.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                classNames(
                  "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors",
                  isActive ? "text-clinic-700 bg-clinic-50" : "text-ink-500"
                )
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-ink-100 py-6">
        <p className="text-center text-xs text-ink-300">
          &copy; {new Date().getFullYear()} {APP_NAME}. Built for modern clinics.
        </p>
      </footer>
    </div>
  );
}
