import { useState } from "react";
import { Input, Select } from "../../common/Input";
import { Button } from "../../common/Button";
import { DEPARTMENTS } from "../../../utils/constants";

export function DoctorForm({ onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState({
    name: "",
    department: DEPARTMENTS[0],
    email: "",
    phone: "",
    experience: "",
  });
  const [errors, setErrors] = useState({});

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Doctor name is required.";
    if (!form.email.trim()) nextErrors.email = "Email is required.";
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    onSubmit({ ...form, experience: Number(form.experience) || 0 });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Full name" placeholder="e.g. Dr. Sarah Whitfield" value={form.name} onChange={update("name")} error={errors.name} />
      <Select label="Department" value={form.department} onChange={update("department")} options={DEPARTMENTS} />
      <div className="grid grid-cols-2 gap-4">
        <Input type="email" label="Email" placeholder="name@pulseline.clinic" value={form.email} onChange={update("email")} error={errors.email} />
        <Input label="Phone" placeholder="555-0100" value={form.phone} onChange={update("phone")} />
      </div>
      <Input type="number" label="Years of experience" min="0" value={form.experience} onChange={update("experience")} />
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          Add doctor
        </Button>
      </div>
    </form>
  );
}
