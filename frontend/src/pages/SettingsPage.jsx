import { Card } from "../components/common/Card";
import { ProfileForm, ToggleRow } from "../components/features/Settings";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { useState } from "react";

export default function SettingsPage() {
  const { user } = useAuth();
  const { notify } = useToast();
  const [saving, setSaving] = useState(false);

  const handleSave = async (values) => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    notify(`Profile updated for ${values.name}.`, { type: "success" });
  };

  return (
    <div className="space-y-6 animate-fadeUp max-w-3xl">
      <div>
        <h1 className="text-2xl font-display font-semibold">Settings</h1>
        <p className="text-sm text-ink-500 mt-1">Manage your profile and clinic preferences.</p>
      </div>

      <Card>
        <Card.Header title="Profile" subtitle="Your personal account details" />
        <ProfileForm user={user} onSave={handleSave} saving={saving} />
      </Card>

      <Card>
        <Card.Header title="Notifications" subtitle="Choose what you're alerted about" />
        <div>
          <ToggleRow label="New appointment requests" description="Get notified when a patient books a visit." defaultChecked />
          <ToggleRow label="Cancellations" description="Alert me when an appointment is cancelled." defaultChecked />
          <ToggleRow label="Daily summary email" description="A recap of the day's schedule, sent each evening." />
        </div>
      </Card>

      <Card>
        <Card.Header title="Clinic details" subtitle="Shown on patient-facing confirmations" />
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-ink-500">Clinic name</p>
            <p className="font-medium text-ink-900 mt-0.5">Pulseline Clinic</p>
          </div>
          <div>
            <p className="text-ink-500">Time zone</p>
            <p className="font-medium text-ink-900 mt-0.5">Asia/Kathmandu (GMT+5:45)</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
