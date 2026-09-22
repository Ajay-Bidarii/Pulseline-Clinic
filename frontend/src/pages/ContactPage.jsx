import { useState } from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Card } from "../components/common/Card";
import { Input } from "../components/common/Input";
import { Button } from "../components/common/Button";
import { useToast } from "../hooks/useToast";

const details = [
  { icon: MapPin, label: "Address", value: "24 Ringroad, Janakpur, Madhesh, Nepal" },
  { icon: Phone, label: "Phone", value: "+977 41-555-0100" },
  { icon: Mail, label: "Email", value: "hello@pulseline.clinic" },
  { icon: Clock, label: "Hours", value: "Sun–Fri, 8:00 AM – 6:00 PM" },
];

export default function ContactPage() {
  const { notify } = useToast();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 600));
    setSending(false);
    setForm({ name: "", email: "", message: "" });
    notify("Message sent — we'll get back to you within a day.", { type: "success" });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-16">
      <div className="mb-10 text-center">
        <h1 className="text-2xl md:text-3xl font-display font-semibold text-ink-900">Get in touch</h1>
        <p className="text-sm text-ink-500 mt-2">Questions about a visit, billing, or your records? We're happy to help.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-display font-semibold text-ink-900 mb-4">Send a message</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Your name" value={form.name} onChange={update("name")} required />
            <Input type="email" label="Email address" value={form.email} onChange={update("email")} required />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-ink-700">Message</label>
              <textarea
                rows={4}
                required
                className="w-full rounded-lg border border-ink-100 bg-white text-sm text-ink-900 px-3.5 py-2.5 outline-none focus:border-clinic-400 resize-none"
                value={form.message}
                onChange={update("message")}
              />
            </div>
            <Button type="submit" className="w-full" loading={sending}>
              Send message
            </Button>
          </form>
        </Card>

        <Card className="space-y-5">
          <h3 className="font-display font-semibold text-ink-900">Clinic details</h3>
          {details.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-clinic-50 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-clinic-600" />
              </div>
              <div>
                <p className="text-xs text-ink-300">{label}</p>
                <p className="text-sm font-medium text-ink-900">{value}</p>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
