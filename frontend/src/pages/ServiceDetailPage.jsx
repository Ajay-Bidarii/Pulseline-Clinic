import { Link, useParams } from "react-router-dom";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { EmptyState } from "../components/common/EmptyState";
import { mockServices } from "../services/mockData";
import { formatCurrency } from "../utils/formatters";
import { ROUTES } from "../utils/constants";
import { FileQuestion } from "lucide-react";

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const service = mockServices.find((s) => s.slug === slug);

  if (!service) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24">
        <EmptyState
          icon={FileQuestion}
          title="Service not found"
          description="This service may have been renamed or removed."
          action={
            <Link to={ROUTES.SERVICES}>
              <Button size="sm">Back to services</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-8 py-16">
      <Card>
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs text-clinic-600 font-medium">{service.department}</p>
            <h1 className="text-2xl font-display font-semibold text-ink-900 mt-1">{service.name}</h1>
          </div>
          <span className="text-clinic-600 font-display text-xl font-semibold">{formatCurrency(service.price)}</span>
        </div>
        <p className="text-sm text-ink-500 mb-6">{service.description}</p>
        <div className="flex items-center gap-6 text-sm text-ink-500 mb-8 border-t border-ink-100 pt-5">
          <div>
            <p className="text-ink-300">Typical duration</p>
            <p className="font-medium text-ink-900">{service.duration}</p>
          </div>
          <div>
            <p className="text-ink-300">Department</p>
            <p className="font-medium text-ink-900">{service.department}</p>
          </div>
        </div>
        <Link to={`${ROUTES.HOME}#book`}>
          <Button className="w-full">Book this service</Button>
        </Link>
      </Card>
    </div>
  );
}
