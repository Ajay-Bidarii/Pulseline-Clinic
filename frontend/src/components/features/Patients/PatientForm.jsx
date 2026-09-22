import { useState } from "react";
import { Input, Select } from "../../common/Input";
import { Button } from "../../common/Button";

const BLOOD_GROUPS = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

export function PatientForm({ onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "Female",
    phone: "",
    email: "",
    bloodGroup: BLOOD_GROUPS[0],
    condition: "",
  });
  const [errors, setErrors] = useState({});

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Full name is required.";
    if (!form.age || Number(form.age) <= 0) nextErrors.age = "Enter a valid age.";
    if (!form.phone.trim()) nextErrors.phone = "Phone number is required.";
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    onSubmit({ ...form, age: Number(form.age) });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Full name" placeholder="e.g. Elena Marsh" value={form.name} onChange={update("name")} error={errors.name} />
      <div className="grid grid-cols-2 gap-4">
        <Input type="number" label="Age" min="0" value={form.age} onChange={update("age")} error={errors.age} />
        <Select label="Gender" value={form.gender} onChange={update("gender")} options={["Female", "Male", "Other"]} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Phone" placeholder="555-0100" value={form.phone} onChange={update("phone")} error={errors.phone} />
        <Select label="Blood group" value={form.bloodGroup} onChange={update("bloodGroup")} options={BLOOD_GROUPS} />
      </div>
      <Input type="email" label="Email" placeholder="name@mail.com" value={form.email} onChange={update("email")} />
      <Input label="Condition / reason" placeholder="e.g. Hypertension follow-up" value={form.condition} onChange={update("condition")} />
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          Add patient
        </Button>
      </div>
    </form>
  );
}
