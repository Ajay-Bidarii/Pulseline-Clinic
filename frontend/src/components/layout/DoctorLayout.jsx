import { Link, Outlet, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { APP_NAME, ROUTES } from "../../utils/constants";
import { Button } from "../common/Button";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { initials } from "../../utils/formatters";

export function DoctorLayout() {
  const { user, logout } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    notify("Signed out successfully.", { type: "success" });
    navigate(ROUTES.HOME);
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <header className="h-16 shrink-0 border-b border-ink-100 bg-surface-raised sticky top-0 z-30">
        <div className="max-w-5xl mx-auto h-full px-4 md:px-8 flex items-center justify-between">
          <Link to={ROUTES.DOCTOR_PORTAL} className="flex items-center gap-2.5">
            <svg width="28" height="28" viewBox="0 0 64 64" className="shrink-0">
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
            <span className="font-display font-semibold text-ink-900 text-[15px]">{APP_NAME}</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-clinic-600 text-white flex items-center justify-center text-xs font-semibold">
                {initials(user?.name || "D")}
              </div>
              <div>
                <p className="text-sm font-medium text-ink-900 leading-none">{user?.name}</p>
                <p className="text-xs text-ink-500 leading-none mt-0.5">{user?.department}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" icon={LogOut} onClick={handleLogout}>
              Sign out
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 md:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
