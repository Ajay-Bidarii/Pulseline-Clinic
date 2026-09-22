import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Card } from "../components/common/Card";
import { mockServices } from "../services/mockData";
import { serviceDetailPath } from "../utils/constants";
import { formatCurrency } from "../utils/formatters";

export default function ServicesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-16">
      <div className="mb-10 text-center">
        <h1 className="text-2xl md:text-3xl font-display font-semibold text-ink-900">Our services</h1>
        <p className="text-sm text-ink-500 mt-2 max-w-lg mx-auto">
          Straightforward pricing across every department, so you know what to expect before you book.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {mockServices.map((service) => (
          <Card key={service.slug} className="flex flex-col">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-display font-semibold text-ink-900">{service.name}</h3>
              <span className="text-clinic-600 font-display font-semibold">{formatCurrency(service.price)}</span>
            </div>
            <p className="text-xs text-ink-500 mb-3">{service.department} &middot; {service.duration}</p>
            <p className="text-sm text-ink-500 flex-1">{service.description}</p>
            <Link
              to={serviceDetailPath(service.slug)}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-clinic-600 hover:underline"
            >
              Learn more <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
