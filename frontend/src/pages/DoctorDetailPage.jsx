import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Star, Mail, Phone, FileQuestion } from "lucide-react";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { Badge } from "../components/common/Badge";
import { EmptyState } from "../components/common/EmptyState";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { doctorService } from "../services/doctorService";
import { initials } from "../utils/formatters";
import { ROUTES } from "../utils/constants";

const statusMap = {
  available: { label: "Available", tone: "clinic" },
  "in-consult": { label: "In consult", tone: "amber" },
  "off-duty": { label: "Off duty", tone: "neutral" },
};

export default function DoctorDetailPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    doctorService.getById(id).then((data) => {
      setDoctor(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <LoadingSpinner full label="Loading doctor profile" />;

  if (!doctor) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24">
        <EmptyState
          icon={FileQuestion}
          title="Doctor not found"
          description="This profile may have moved."
          action={
            <Link to={ROUTES.HOME}>
              <Button size="sm">Back to home</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const status = statusMap[doctor.status] || statusMap.available;

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-8 py-16">
      <Card>
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-clinic-600 text-white flex items-center justify-center font-display text-xl font-semibold shrink-0">
              {initials(doctor.name)}
            </div>
            <div>
              <h1 className="text-xl font-display font-semibold text-ink-900">{doctor.name}</h1>
              <p className="text-sm text-ink-500">{doctor.department}</p>
            </div>
          </div>
          <Badge tone={status.tone} dot>
            {status.label}
          </Badge>
        </div>

        <div className="flex items-center gap-1 text-amber-600 text-sm font-medium mb-6">
          <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
          {doctor.rating}
          <span className="text-ink-300 font-normal ml-1">
            &middot; {doctor.experience} yrs experience &middot; {doctor.patients} patients treated
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-ink-500 border-t border-ink-100 pt-5 mb-6">
          <p className="flex items-center gap-2">
            <Mail className="w-4 h-4 shrink-0" /> {doctor.email}
          </p>
          <p className="flex items-center gap-2">
            <Phone className="w-4 h-4 shrink-0" /> {doctor.phone}
          </p>
        </div>

        <Link to={`${ROUTES.HOME}#book`}>
          <Button className="w-full">Book with {doctor.name.split(" ")[1] || doctor.name}</Button>
        </Link>
      </Card>
    </div>
  );
}
