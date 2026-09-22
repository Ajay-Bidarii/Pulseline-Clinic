import { Badge } from "../../common/Badge";
import { APPOINTMENT_STATUS_LABELS } from "../../../utils/constants";

const toneMap = {
  confirmed: "clinic",
  pending: "amber",
  cancelled: "coral",
  completed: "neutral",
};

export function StatusBadge({ status }) {
  return (
    <Badge tone={toneMap[status] || "neutral"} dot>
      {APPOINTMENT_STATUS_LABELS[status] || status}
    </Badge>
  );
}
