import { useState } from "react";
import { Input, Select } from "../../common/Input";
import { Button } from "../../common/Button";
import { DEPARTMENTS } from "../../../utils/constants";

export function GuestBookingForm({ doctors = [], onSubmit, submitting }) {
  const [form, setForm] = useState({
    patientName: "",
    email: "",
    phone: "",
    department: DEPARTMENTS[0],
    doctorName: doctors[0]?.name || "",
    date: "",
    time: "",
    reason: "",
  });
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (!form.patientName.trim()) nextErrors.patientName = "Your name is required.";
    if (!form.email.trim()) nextErrors.email = "An email helps us confirm your visit.";
    if (!form.date) nextErrors.date = "Choose a date.";
    if (!form.time) nextErrors.time = "Choose a time.";
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    const datetime = new Date(`${form.date}T${form.time}`).toISOString();
    await onSubmit({
      patientName: form.patientName,
      patientEmail: form.email,
      patientPhone: form.phone,
      department: form.department,
      doctorName: form.doctorName,
      datetime,
      reason: form.reason || "General consultation",
    });
    setDone(true);
  };

  if (done) {
    return (
      <div className="text-center py-6">
        <div className="w-12 h-12 rounded-full bg-clinic-100 text-clinic-600 flex items-center justify-center mx-auto mb-4 text-xl">
          ✓
        </div>
        <h4 className="font-display font-semibold text-ink-900 mb-1">Request sent</h4>
        <p className="text-sm text-ink-500 max-w-sm mx-auto">
          We've received your request and a staff member will confirm it shortly. Create a patient
          account with the same email to track its status any time.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Full name" placeholder="e.g. Elena Marsh" value={form.patientName} onChange={update("patientName")} error={errors.patientName} />
      <div className="grid grid-cols-2 gap-4">
        <Input type="email" label="Email" placeholder="you@mail.com" value={form.email} onChange={update("email")} error={errors.email} />
        <Input label="Phone" placeholder="555-0100" value={form.phone} onChange={update("phone")} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Select label="Department" value={form.department} onChange={update("department")} options={DEPARTMENTS} />
        <Select label="Doctor" value={form.doctorName} onChange={update("doctorName")} options={doctors.map((d) => d.name)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input type="date" label="Preferred date" value={form.date} onChange={update("date")} error={errors.date} />
        <Input type="time" label="Preferred time" value={form.time} onChange={update("time")} error={errors.time} />
      </div>
      <Input label="Reason for visit" placeholder="e.g. General checkup" value={form.reason} onChange={update("reason")} />
      <Button type="submit" className="w-full" loading={submitting}>
        Request appointment
      </Button>
    </form>
  );
}
