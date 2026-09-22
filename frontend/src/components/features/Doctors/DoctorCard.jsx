import { Star, Mail, Phone } from "lucide-react";
import { Card } from "../../common/Card";
import { Badge } from "../../common/Badge";
import { initials } from "../../../utils/formatters";

const statusMap = {
  available: { label: "Available", tone: "clinic" },
  "in-consult": { label: "In consult", tone: "amber" },
  "off-duty": { label: "Off duty", tone: "neutral" },
};

export function DoctorCard({ doctor }) {
  const status = statusMap[doctor.status] || statusMap.available;

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-clinic-600 text-white flex items-center justify-center font-display font-semibold shrink-0">
            {initials(doctor.name)}
          </div>
          <div>
            <p className="font-display font-semibold text-ink-900">{doctor.name}</p>
            <p className="text-xs text-ink-500">{doctor.department}</p>
          </div>
        </div>
        <Badge tone={status.tone} dot>
          {status.label}
        </Badge>
      </div>

      <div className="flex items-center gap-1 text-amber-600 text-sm font-medium">
        <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
        {doctor.rating}
        <span className="text-ink-300 font-normal ml-1">
          &middot; {doctor.experience} yrs &middot; {doctor.patients} patients
        </span>
      </div>

      <div className="pt-3 border-t border-ink-100 space-y-1.5 text-sm text-ink-500">
        <p className="flex items-center gap-2 truncate">
          <Mail className="w-3.5 h-3.5 shrink-0" /> {doctor.email}
        </p>
        <p className="flex items-center gap-2">
          <Phone className="w-3.5 h-3.5 shrink-0" /> {doctor.phone}
        </p>
      </div>
    </Card>
  );
}
