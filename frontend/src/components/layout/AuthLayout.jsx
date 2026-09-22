import { Outlet } from "react-router-dom";
import { APP_NAME } from "../../utils/constants";

function BrandPanel() {
  return (
    <div className="hidden lg:flex flex-col justify-between w-1/2 bg-clinic-900 relative overflow-hidden px-12 py-12">
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.08]"
        viewBox="0 0 400 400"
        preserveAspectRatio="none"
      >
        <path
          d="M0 210 H60 L80 130 L120 300 L150 180 L175 210 L195 150 L215 210 H400"
          fill="none"
          stroke="#DEEEE6"
          strokeWidth="3"
        />
      </svg>
      <div className="relative flex items-center gap-2.5">
        <svg width="34" height="34" viewBox="0 0 64 64">
          <rect width="64" height="64" rx="16" fill="#DEEEE6" />
          <path
            d="M6 34h9l4-14 8 26 6-18 4 6h21"
            fill="none"
            stroke="#146356"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="font-display font-semibold text-clinic-50 text-lg">{APP_NAME}</span>
      </div>
      <div className="relative max-w-sm">
        <h2 className="font-display text-3xl font-semibold text-white leading-tight">
          Every patient's care, in one steady rhythm.
        </h2>
        <p className="text-clinic-200 mt-4 text-sm leading-relaxed">
          Schedule appointments, track patient records, and coordinate your care
          team — all from a single, calm dashboard built for busy front desks.
        </p>
      </div>
      <p className="relative text-clinic-300 text-xs">
        &copy; {new Date().getFullYear()} {APP_NAME}. Built for modern clinics.
      </p>
    </div>
  );
}

export function AuthLayout() {
  return (
    <div className="min-h-screen flex bg-surface">
      <BrandPanel />
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm animate-fadeUp">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
