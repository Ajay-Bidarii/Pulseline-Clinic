import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { classNames } from "../../../utils/formatters";

const variants = {
  primary: "bg-clinic-600 text-white hover:bg-clinic-700 shadow-card",
  secondary: "bg-clinic-100 text-clinic-800 hover:bg-clinic-200",
  outline: "border border-ink-100 text-ink-700 hover:border-clinic-400 hover:text-clinic-700 bg-white",
  ghost: "text-ink-500 hover:bg-surface-sunken hover:text-ink-900",
  danger: "bg-coral-500 text-white hover:bg-coral-600",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm gap-1.5",
  md: "px-4 py-2.5 text-sm gap-2",
  lg: "px-5 py-3 text-base gap-2",
};

export const Button = forwardRef(function Button(
  { variant = "primary", size = "md", loading = false, icon: Icon, className, children, disabled, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={classNames(
        "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150",
        "disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : Icon ? <Icon className="w-4 h-4" /> : null}
      {children}
    </button>
  );
});
