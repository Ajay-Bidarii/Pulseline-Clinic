import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { Input } from "../components/common/Input";
import { Button } from "../components/common/Button";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { ROUTES } from "../utils/constants";

export default function LoginPage() {
  const { login } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form);
      notify("Welcome back!", { type: "success" });
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      setError(err.message || "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold text-ink-900">Staff sign in</h1>
      <p className="text-sm text-ink-500 mt-1.5 mb-8">Access the clinic admin dashboard.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          label="Email address"
          placeholder="you@pulseline.clinic"
          icon={Mail}
          value={form.email}
          onChange={update("email")}
          required
        />
        <Input
          type="password"
          label="Password"
          placeholder="••••••••"
          icon={Lock}
          value={form.password}
          onChange={update("password")}
          required
        />
        {error && <p className="text-sm text-coral-600">{error}</p>}
        <Button type="submit" className="w-full" loading={loading}>
          Sign in
        </Button>
      </form>

      <p className="text-sm text-ink-400 mt-6 text-center">
        <Link to={ROUTES.HOME} className="hover:underline">
          &larr; Back to clinic home
        </Link>
      </p>

      <div className="text-xs text-ink-300 mt-8 text-center space-y-1">
        <p>Staff accounts are provisioned by the clinic — no self-signup.</p>
        <p>
          Demo access: <span className="font-medium text-ink-500">admin@pulseline.clinic</span>{" "}
          with any password (4+ characters).
        </p>
      </div>
    </div>
  );
}
