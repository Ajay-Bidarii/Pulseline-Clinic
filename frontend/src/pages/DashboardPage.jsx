import { useEffect, useState } from "react";
import { CalendarClock, Users, Stethoscope, Activity } from "lucide-react";
import { Card } from "../components/common/Card";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { Table } from "../components/common/Table";
import { StatCard, ActivityChart } from "../components/features/Dashboard";
import { StatusBadge } from "../components/features/Appointments";
import { appointmentService } from "../services/appointmentService";
import { patientService } from "../services/patientService";
import { doctorService } from "../services/doctorService";
import { formatDateTime } from "../utils/formatters";
import { useAuth } from "../hooks/useAuth";

export default function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    let active = true;
    (async () => {
      const [appts, pts, docs] = await Promise.all([
        appointmentService.getAll(),
        patientService.getAll(),
        doctorService.getAll(),
      ]);
      if (!active) return;
      setAppointments(appts);
      setPatients(pts);
      setDoctors(docs);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  if (loading) return <LoadingSpinner full label="Loading your dashboard" />;

  const today = new Date().toDateString();
  const todaysAppointments = appointments.filter((a) => new Date(a.datetime).toDateString() === today);
  const availableDoctors = doctors.filter((d) => d.status === "available");
  const upcoming = appointments
    .filter((a) => new Date(a.datetime) >= new Date() && a.status !== "cancelled")
    .slice(0, 6);

  const columns = [
    { key: "patientName", header: "Patient" },
    { key: "doctorName", header: "Doctor" },
    {
      key: "datetime",
      header: "Scheduled",
      render: (row) => formatDateTime(row.datetime),
    },
    { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
  ];

  return (
    <div className="space-y-6 animate-fadeUp">
      <div>
        <h1 className="text-2xl font-display font-semibold">Welcome back, {user?.name?.split(" ")[0] || "there"}</h1>
        <p className="text-sm text-ink-500 mt-1">Here's what's happening at the clinic today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Today's appointments" value={todaysAppointments.length} delta="+12% vs last week" icon={CalendarClock} />
        <StatCard label="Total patients" value={patients.length} delta="+4 this month" icon={Users} />
        <StatCard label="Doctors available" value={`${availableDoctors.length}/${doctors.length}`} icon={Stethoscope} />
        <StatCard label="Avg. consult rating" value="4.8/5" delta="Steady" icon={Activity} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2">
          <Card.Header title="Weekly appointment volume" subtitle="Confirmed and completed visits, last 7 days" />
          <ActivityChart />
        </Card>
        <Card>
          <Card.Header title="Doctors on shift" subtitle="Live availability" />
          <div className="space-y-3">
            {doctors.slice(0, 5).map((doc) => (
              <div key={doc.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-ink-900">{doc.name}</p>
                  <p className="text-xs text-ink-500">{doc.department}</p>
                </div>
                <span
                  className={
                    doc.status === "available"
                      ? "text-xs font-medium text-clinic-600"
                      : doc.status === "in-consult"
                      ? "text-xs font-medium text-amber-600"
                      : "text-xs font-medium text-ink-300"
                  }
                >
                  {doc.status.replace("-", " ")}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <Card.Header title="Upcoming appointments" subtitle="Next scheduled visits across all departments" />
        <Table columns={columns} data={upcoming} />
      </Card>
    </div>
  );
}
