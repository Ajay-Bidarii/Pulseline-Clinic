import { useState } from "react";
import { classNames } from "../../../utils/formatters";

export function ToggleRow({ label, description, defaultChecked = false }) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <div className="flex items-center justify-between py-3.5 border-b border-ink-100 last:border-0">
      <div className="pr-6">
        <p className="text-sm font-medium text-ink-900">{label}</p>
        {description && <p className="text-xs text-ink-500 mt-0.5">{description}</p>}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => setChecked((c) => !c)}
        className={classNames(
          "relative w-11 h-6 rounded-full transition-colors shrink-0",
          checked ? "bg-clinic-600" : "bg-ink-100"
        )}
      >
        <span
          className={classNames(
            "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-card transition-transform",
            checked && "translate-x-5"
          )}
        />
      </button>
    </div>
  );
}
