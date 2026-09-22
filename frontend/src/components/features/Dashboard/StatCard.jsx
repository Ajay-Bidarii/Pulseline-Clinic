import { classNames } from "../../../utils/formatters";
import { Card } from "../../common/Card";

export function StatCard({ label, value, delta, deltaTone = "clinic", icon: Icon }) {
  return (
    <Card className="flex items-start justify-between">
      <div>
        <p className="text-sm text-ink-500">{label}</p>
        <p className="text-2xl font-display font-semibold text-ink-900 mt-2">{value}</p>
        {delta && (
          <p
            className={classNames(
              "text-xs font-medium mt-2 inline-flex items-center gap-1",
              deltaTone === "clinic" ? "text-clinic-600" : "text-coral-600"
            )}
          >
            {delta}
          </p>
        )}
      </div>
      {Icon && (
        <div className="w-10 h-10 rounded-lg bg-clinic-50 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-clinic-600" />
        </div>
      )}
    </Card>
  );
}
