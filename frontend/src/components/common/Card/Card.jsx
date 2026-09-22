import { classNames } from "../../../utils/formatters";

export function Card({ className, padded = true, children, ...props }) {
  return (
    <div
      className={classNames(
        "bg-surface-raised rounded-xl2 border border-ink-100/70 shadow-card",
        padded && "p-5 md:p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

Card.Header = function CardHeader({ title, subtitle, action, className }) {
  return (
    <div className={classNames("flex items-start justify-between gap-4 mb-5", className)}>
      <div>
        <h3 className="text-base font-display font-semibold text-ink-900">{title}</h3>
        {subtitle && <p className="text-sm text-ink-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};
