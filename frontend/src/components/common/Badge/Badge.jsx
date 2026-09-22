import { classNames } from "../../../utils/formatters";

const tones = {
  clinic: "bg-clinic-100 text-clinic-700",
  coral: "bg-coral-100 text-coral-600",
  amber: "bg-amber-100 text-amber-600",
  neutral: "bg-ink-100 text-ink-700",
};

export function Badge({ tone = "neutral", dot = false, children, className }) {
  return (
    <span
      className={classNames(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
        tones[tone],
        className
      )}
    >
      {dot && <span className={classNames("w-1.5 h-1.5 rounded-full", tone === "clinic" ? "bg-clinic-500" : tone === "coral" ? "bg-coral-500" : tone === "amber" ? "bg-amber-500" : "bg-ink-500")} />}
      {children}
    </span>
  );
}
