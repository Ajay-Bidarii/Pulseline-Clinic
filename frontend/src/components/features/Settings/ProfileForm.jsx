import { useState } from "react";
import { Input } from "../../common/Input";
import { Button } from "../../common/Button";

export function ProfileForm({ user, onSave, saving }) {
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "" });

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <Input label="Full name" value={form.name} onChange={update("name")} />
      <Input type="email" label="Email address" value={form.email} onChange={update("email")} />
      <div className="pt-2">
        <Button type="submit" loading={saving}>
          Save changes
        </Button>
      </div>
    </form>
  );
}
