import { classNames } from "../../../utils/formatters";

export function LoadingSpinner({ label = "Loading", size = "md", full = false }) {
  const dims = { sm: 60, md: 90, lg: 130 };
  const width = dims[size] || dims.md;

  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <svg width={width} height={width / 3} viewBox="0 0 180 60" className="text-clinic-500">
        <path
          d="M0 30 H45 L58 8 L74 52 L86 30 L96 30 L106 18 L116 30 H180"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="240"
          className="animate-pulseLine"
        />
      </svg>
      {label && <p className="text-sm text-ink-500 font-medium">{label}&hellip;</p>}
    </div>
  );

  if (!full) return spinner;

  return (
    <div className={classNames("flex items-center justify-center w-full py-16")}>{spinner}</div>
  );
}
