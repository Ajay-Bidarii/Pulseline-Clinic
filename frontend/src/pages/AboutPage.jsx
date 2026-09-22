import { HeartPulse, ShieldCheck, Clock, Users } from "lucide-react";
import { Card } from "../components/common/Card";
import { APP_NAME } from "../utils/constants";

const values = [
  { icon: HeartPulse, title: "Patient-first care", text: "Every visit is designed around comfort, clarity, and follow-through — not just a diagnosis." },
  { icon: ShieldCheck, title: "Trusted records", text: "Your medical history stays secure and accessible only to your care team and you." },
  { icon: Clock, title: "Respect for your time", text: "Live queue tracking and same-week scheduling mean less time in the waiting room." },
  { icon: Users, title: "A real care team", text: "Specialists across 8 departments coordinate on your care, not just your appointment." },
];

export default function AboutPage() {
  return (
    <div>
      <section className="bg-clinic-900 py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 md:px-8 text-center">
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-white">About {APP_NAME}</h1>
          <p className="text-clinic-200 mt-4 text-sm md:text-base">
            We started {APP_NAME} to make everyday healthcare feel less like a queue number and more
            like being known. From routine checkups to specialist referrals, our team keeps your care
            connected — before, during, and after every visit.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {values.map(({ icon: Icon, title, text }) => (
            <Card key={title} className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-lg bg-clinic-50 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-clinic-600" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-ink-900">{title}</h3>
                <p className="text-sm text-ink-500 mt-1">{text}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-surface-sunken py-16">
        <div className="max-w-3xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-xl font-display font-semibold text-ink-900">Where we are</h2>
          <p className="text-sm text-ink-500 mt-2">
            {APP_NAME} operates from a single clinic location with specialists across General Medicine,
            Pediatrics, Cardiology, Orthopedics, Dermatology, Gynecology, ENT, and Neurology.
          </p>
        </div>
      </section>
    </div>
  );
}
