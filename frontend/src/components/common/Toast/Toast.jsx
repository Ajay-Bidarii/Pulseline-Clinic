import { CheckCircle2, AlertTriangle, Info, XCircle, X } from "lucide-react";
import { classNames } from "../../../utils/formatters";

const styles = {
  success: { icon: CheckCircle2, bar: "bg-clinic-500", iconColor: "text-clinic-600" },
  error: { icon: XCircle, bar: "bg-coral-500", iconColor: "text-coral-600" },
  warning: { icon: AlertTriangle, bar: "bg-amber-500", iconColor: "text-amber-600" },
  info: { icon: Info, bar: "bg-clinic-400", iconColor: "text-clinic-600" },
};

export function Toast({ message, type = "info", onDismiss }) {
  const { icon: Icon, bar, iconColor } = styles[type] || styles.info;

  return (
    <div className="relative overflow-hidden bg-surface-raised rounded-xl shadow-pop border border-ink-100/70 flex items-start gap-3 p-4 animate-fadeUp">
      <span className={classNames("absolute left-0 top-0 bottom-0 w-1", bar)} />
      <Icon className={classNames("w-5 h-5 shrink-0 mt-0.5", iconColor)} />
      <p className="text-sm text-ink-700 flex-1">{message}</p>
      <button onClick={onDismiss} className="text-ink-300 hover:text-ink-700" aria-label="Dismiss notification">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
