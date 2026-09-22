import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarClock, ShieldCheck, Users } from "lucide-react";
import { Card } from "../components/common/Card";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { DoctorCard } from "../components/features/Doctors";
import { GuestBookingForm } from "../components/features/Visitor";
import { doctorService } from "../services/doctorService";
import { appointmentService } from "../services/appointmentService";
import { doctorDetailPath } from "../utils/constants";
import { useToast } from "../hooks/useToast";

export default function VisitorPage() {
  const { notify } = useToast();
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    doctorService.getAll().then((data) => {
      setDoctors(data);
      setLoading(false);
    });
  }, []);

  const handleGuestBooking = async (payload) => {
    setSubmitting(true);
    try {
      await appointmentService.create(payload);
      notify("Your appointment request has been sent.", { type: "success" });
    } catch (err) {
      notify(err.message || "Something went wrong. Please try again.", { type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-clinic-900">
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.08]"
          viewBox="0 0 800 300"
          preserveAspectRatio="none"
        >
          <path
            d="M0 150 H120 L160 60 L240 240 L300 100 L350 150 L390 90 L430 150 H800"
            fill="none"
            stroke="#DEEEE6"
            strokeWidth="3"
          />
        </svg>
        <div className="relative max-w-6xl mx-auto px-4 md:px-8 py-20 md:py-28 text-center">
          <h1 className="font-display text-3xl md:text-5xl font-semibold text-white leading-tight max-w-2xl mx-auto">
            Every patient's care, in one steady rhythm.
          </h1>
          <p className="text-clinic-200 mt-5 max-w-xl mx-auto text-sm md:text-base">
            Book an appointment with our care team in minutes — no account required. Prefer to
            track your visits over time? Create a free patient account any time.
          </p>
        </div>
      </section>

      {/* Trust strip */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 -mt-10 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-clinic-50 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-clinic-600" />
            </div>
            <div>
              <p className="font-display font-semibold text-ink-900">{doctors.length || "6"}+ specialists</p>
              <p className="text-xs text-ink-500">Across 8 departments</p>
            </div>
          </Card>
          <Card className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-clinic-50 flex items-center justify-center shrink-0">
              <CalendarClock className="w-5 h-5 text-clinic-600" />
            </div>
            <div>
              <p className="font-display font-semibold text-ink-900">Same-week visits</p>
              <p className="text-xs text-ink-500">Most requests confirmed within 24h</p>
            </div>
          </Card>
          <Card className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-clinic-50 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-clinic-600" />
            </div>
            <div>
              <p className="font-display font-semibold text-ink-900">Trusted records</p>
              <p className="text-xs text-ink-500">Your history, kept secure</p>
            </div>
          </Card>
        </div>
      </section>

      {/* Doctors */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-16">
        <div className="mb-8">
          <h2 className="text-xl font-display font-semibold text-ink-900">Meet our care team</h2>
          <p className="text-sm text-ink-500 mt-1">Available specialists you can book with today.</p>
        </div>
        {loading ? (
          <LoadingSpinner full label="Loading our doctors" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {doctors.map((doctor) => (
              <Link key={doctor.id} to={doctorDetailPath(doctor.id)} className="block">
                <DoctorCard doctor={doctor} />
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Booking */}
      <section className="bg-surface-sunken py-16" id="book">
        <div className="max-w-xl mx-auto px-4 md:px-8">
          <div className="text-center mb-8">
            <h2 className="text-xl font-display font-semibold text-ink-900">Request an appointment</h2>
            <p className="text-sm text-ink-500 mt-1">
              No account needed. We'll reach out to confirm your visit.
            </p>
          </div>
          <Card>
            {loading ? <LoadingSpinner label="Preparing the form" /> : (
              <GuestBookingForm doctors={doctors} onSubmit={handleGuestBooking} submitting={submitting} />
            )}
          </Card>
        </div>
      </section>
    </div>
  );
}
