import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Phone } from "lucide-react";
import { Input } from "../components/common/Input";
import { Button } from "../components/common/Button";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { ROUTES } from "../utils/constants";

export default function PatientRegisterPage() {
  const { registerPatient } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await registerPatient(form);
      notify("Account created. Welcome!", { type: "success" });
      navigate(ROUTES.PATIENT_PORTAL);
    } catch (err) {
      setError(err.message || "Unable to create your account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold text-ink-900">Create your patient account</h1>
      <p className="text-sm text-ink-500 mt-1.5 mb-8">Track appointments and your visit history.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Full name" placeholder="Jane Cooper" icon={User} value={form.name} onChange={update("name")} required />
        <Input
          type="email"
          label="Email address"
          placeholder="you@mail.com"
          icon={Mail}
          value={form.email}
          onChange={update("email")}
          required
        />
        <Input label="Phone" placeholder="555-0100" icon={Phone} value={form.phone} onChange={update("phone")} />
        <Input
          type="password"
          label="Password"
          placeholder="At least 4 characters"
          icon={Lock}
          value={form.password}
          onChange={update("password")}
          required
        />
        {error && <p className="text-sm text-coral-600">{error}</p>}
        <Button type="submit" className="w-full" loading={loading}>
          Create account
        </Button>
      </form>

      <p className="text-sm text-ink-500 mt-6 text-center">
        Already have an account?{" "}
        <Link to={ROUTES.PATIENT_LOGIN} className="text-clinic-600 font-medium hover:underline">
          Sign in
        </Link>
      </p>
      <p className="text-sm text-ink-400 mt-2 text-center">
        <Link to={ROUTES.HOME} className="hover:underline">
          &larr; Back to clinic home
        </Link>
      </p>
    </div>
  );
}
