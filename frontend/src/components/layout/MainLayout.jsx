import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarClock,
  Users,
  Stethoscope,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  Bell,
  ListOrdered,
  Receipt,
} from "lucide-react";
import { ROUTES, APP_NAME } from "../../utils/constants";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { initials } from "../../utils/formatters";

const navItems = [
  { to: ROUTES.DASHBOARD, label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: ROUTES.APPOINTMENTS, label: "Appointments", icon: CalendarClock },
  { to: ROUTES.PATIENTS, label: "Patients", icon: Users },
  { to: ROUTES.DOCTORS, label: "Doctors", icon: Stethoscope },
  { to: ROUTES.QUEUE, label: "Waiting queue", icon: ListOrdered },
  { to: ROUTES.BILLING, label: "Billing", icon: Receipt },
  { to: ROUTES.SETTINGS, label: "Settings", icon: Settings },
];

function PulseLogo() {
  return (
    <div className="flex items-center gap-2.5">
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
    </div>
  );
}

function SidebarContent({ onNavigate }) {
  const { logout, user } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    notify("Signed out successfully.", { type: "success" });
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-6 pb-8">
        <PulseLogo />
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-clinic-600 text-white shadow-card"
                  : "text-ink-500 hover:bg-clinic-50 hover:text-clinic-700",
              ].join(" ")
            }
          >
            <Icon className="w-[18px] h-[18px]" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 mx-3 mb-4 rounded-xl2 bg-clinic-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-clinic-600 text-white flex items-center justify-center text-xs font-semibold shrink-0">
            {initials(user?.name || "Admin")}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-ink-900 truncate">{user?.name || "Admin"}</p>
            <p className="text-xs text-ink-500 truncate">{user?.title || "Staff"}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-3 w-full flex items-center justify-center gap-2 text-sm font-medium text-coral-600 hover:bg-coral-100 rounded-lg py-2 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}

export function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-surface">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 shrink-0 border-r border-ink-100 bg-surface-raised">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-ink-900/40" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-64 h-full bg-surface-raised animate-fadeUp">
            <button
              className="absolute top-5 right-4 text-ink-400"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 shrink-0 border-b border-ink-100 bg-surface-raised flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
          <button className="lg:hidden text-ink-500" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden md:flex items-center gap-2 bg-surface-sunken rounded-lg px-3 py-2 w-full max-w-xs">
            <Search className="w-4 h-4 text-ink-300" />
            <input
              placeholder="Search patients, doctors..."
              className="bg-transparent outline-none text-sm w-full placeholder:text-ink-300"
            />
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <button className="relative text-ink-500 hover:text-clinic-700 p-2 rounded-lg hover:bg-surface-sunken transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-coral-500" />
            </button>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8 max-w-[1400px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
