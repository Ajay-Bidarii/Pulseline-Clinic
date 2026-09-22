import { useState } from "react";
import { Input, Select } from "../../common/Input";
import { Button } from "../../common/Button";
import { DEPARTMENTS } from "../../../utils/constants";

export function AppointmentForm({ doctors = [], onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState({
    patientName: "",
    department: DEPARTMENTS[0],
    doctorName: doctors[0]?.name || "",
    date: "",
    time: "",
    reason: "",
  });
  const [errors, setErrors] = useState({});

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (!form.patientName.trim()) nextErrors.patientName = "Patient name is required.";
    if (!form.date) nextErrors.date = "Choose a date.";
    if (!form.time) nextErrors.time = "Choose a time.";
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    const datetime = new Date(`${form.date}T${form.time}`).toISOString();
    onSubmit({
      patientName: form.patientName,
      department: form.department,
      doctorName: form.doctorName,
      datetime,
      reason: form.reason || "General consultation",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Patient name"
        placeholder="e.g. Elena Marsh"
        value={form.patientName}
        onChange={update("patientName")}
        error={errors.patientName}
      />
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Department"
          value={form.department}
          onChange={update("department")}
          options={DEPARTMENTS}
        />
        <Select
          label="Doctor"
          value={form.doctorName}
          onChange={update("doctorName")}
          options={doctors.map((d) => d.name)}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input type="date" label="Date" value={form.date} onChange={update("date")} error={errors.date} />
        <Input type="time" label="Time" value={form.time} onChange={update("time")} error={errors.time} />
      </div>
      <Input
        label="Reason for visit"
        placeholder="e.g. Follow-up consultation"
        value={form.reason}
        onChange={update("reason")}
      />
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          Book appointment
        </Button>
      </div>
    </form>
  );
}
