import { Badge } from "../../common/Badge";

const toneMap = {
  active: "clinic",
  monitoring: "amber",
  discharged: "neutral",
};

const labelMap = {
  active: "Active",
  monitoring: "Monitoring",
  discharged: "Discharged",
};

export function PatientStatusBadge({ status }) {
  return (
    <Badge tone={toneMap[status] || "neutral"} dot>
      {labelMap[status] || status}
    </Badge>
  );
}
