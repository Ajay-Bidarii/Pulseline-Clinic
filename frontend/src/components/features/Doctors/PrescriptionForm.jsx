import { useState } from "react";
import { Button } from "../../common/Button";

export function PrescriptionForm({ appointment, onSave, onCancel, saving }) {
  const [form, setForm] = useState({
    diagnosis: appointment?.diagnosis || "",
    prescription: appointment?.prescription || "",
    notes: appointment?.notes || "",
  });

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ink-700">Diagnosis</label>
        <input
          className="w-full rounded-lg border border-ink-100 bg-white text-sm text-ink-900 px-3.5 py-2.5 outline-none focus:border-clinic-400"
          placeholder="e.g. Seasonal allergic rhinitis"
          value={form.diagnosis}
          onChange={update("diagnosis")}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ink-700">Prescription</label>
        <textarea
          rows={3}
          className="w-full rounded-lg border border-ink-100 bg-white text-sm text-ink-900 px-3.5 py-2.5 outline-none focus:border-clinic-400 resize-none"
          placeholder="Medication, dosage, and duration"
          value={form.prescription}
          onChange={update("prescription")}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ink-700">Consultation notes</label>
        <textarea
          rows={3}
          className="w-full rounded-lg border border-ink-100 bg-white text-sm text-ink-900 px-3.5 py-2.5 outline-none focus:border-clinic-400 resize-none"
          placeholder="Any follow-up instructions or observations"
          value={form.notes}
          onChange={update("notes")}
        />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={saving}>
          Save &amp; mark completed
        </Button>
      </div>
    </form>
  );
}
