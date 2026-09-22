import { forwardRef } from "react";
import { classNames } from "../../../utils/formatters";

export const Input = forwardRef(function Input(
  { label, error, hint, icon: Icon, className, containerClassName, id, ...props },
  ref
) {
  const inputId = id || props.name;
  return (
    <div className={classNames("flex flex-col gap-1.5", containerClassName)}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-ink-700">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && <Icon className="w-4 h-4 text-ink-300 absolute left-3 top-1/2 -translate-y-1/2" />}
        <input
          ref={ref}
          id={inputId}
          className={classNames(
            "w-full rounded-lg border bg-white text-sm text-ink-900 placeholder:text-ink-300",
            "px-3.5 py-2.5 transition-colors duration-150",
            Icon && "pl-9",
            error ? "border-coral-500 focus:border-coral-500" : "border-ink-100 focus:border-clinic-400",
            "outline-none",
            className
          )}
          {...props}
        />
      </div>
      {error ? (
        <p className="text-xs text-coral-600">{error}</p>
      ) : hint ? (
        <p className="text-xs text-ink-500">{hint}</p>
      ) : null}
    </div>
  );
});

export const Select = forwardRef(function Select({ label, error, options = [], className, containerClassName, id, ...props }, ref) {
  const selectId = id || props.name;
  return (
    <div className={classNames("flex flex-col gap-1.5", containerClassName)}>
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-ink-700">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={classNames(
          "w-full rounded-lg border bg-white text-sm text-ink-900",
          "px-3.5 py-2.5 transition-colors duration-150 outline-none",
          error ? "border-coral-500" : "border-ink-100 focus:border-clinic-400",
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value ?? opt} value={opt.value ?? opt}>
            {opt.label ?? opt}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-coral-600">{error}</p>}
    </div>
  );
});
