import { useEffect, useState } from "react";
import { CalendarPlus, CalendarX2 } from "lucide-react";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { Modal } from "../components/common/Modal";
import { Table } from "../components/common/Table";
import { EmptyState } from "../components/common/EmptyState";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { AppointmentForm, StatusBadge } from "../components/features/Appointments";
import { appointmentService } from "../services/appointmentService";
import { doctorService } from "../services/doctorService";
import { formatDateTime } from "../utils/formatters";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";

export default function PatientPortalPage() {
  const { user } = useAuth();
  const { notify } = useToast();
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    const [mine, docs] = await Promise.all([
      appointmentService.getByPatientName(user?.name),
      doctorService.getAll(),
    ]);
    setAppointments(mine);
    setDoctors(docs);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.name]);

  const handleBook = async (payload) => {
    setSubmitting(true);
    try {
      await appointmentService.create({ ...payload, patientName: user?.name });
      notify("Appointment requested. We'll confirm it shortly.", { type: "success" });
      setModalOpen(false);
      loadData();
    } catch (err) {
      notify(err.message || "Could not book the appointment.", { type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (id) => {
    await appointmentService.updateStatus(id, "cancelled");
    setAppointments((current) => current.map((a) => (a.id === id ? { ...a, status: "cancelled" } : a)));
    notify("Appointment cancelled.", { type: "info" });
  };

  if (loading) return <LoadingSpinner full label="Loading your visits" />;

  const upcoming = appointments.filter((a) => new Date(a.datetime) >= new Date() && a.status !== "cancelled");
  const past = appointments.filter((a) => new Date(a.datetime) < new Date() || a.status === "cancelled");

  const columns = (showCancel) => [
    { key: "doctorName", header: "Doctor" },
    { key: "department", header: "Department" },
    { key: "datetime", header: "Scheduled", render: (row) => formatDateTime(row.datetime) },
    { key: "reason", header: "Reason" },
    { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
    ...(showCancel
      ? [
          {
            key: "actions",
            header: "",
            render: (row) =>
              row.status !== "cancelled" ? (
                <button
                  onClick={() => handleCancel(row.id)}
                  className="text-xs font-medium text-coral-600 hover:underline"
                >
                  Cancel
                </button>
              ) : null,
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6 animate-fadeUp">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold">Hi, {user?.name?.split(" ")[0]}</h1>
          <p className="text-sm text-ink-500 mt-1">Here's an overview of your appointments.</p>
        </div>
        <Button icon={CalendarPlus} onClick={() => setModalOpen(true)}>
          Book appointment
        </Button>
      </div>

      <Card>
        <Card.Header title="Upcoming appointments" subtitle={`${upcoming.length} scheduled`} />
        <Table
          columns={columns(true)}
          data={upcoming}
          emptyState={
            <EmptyState
              icon={CalendarX2}
              title="No upcoming appointments"
              description="Book a visit with one of our specialists whenever you're ready."
              action={
                <Button size="sm" icon={CalendarPlus} onClick={() => setModalOpen(true)}>
                  Book appointment
                </Button>
              }
            />
          }
        />
      </Card>

      {past.length > 0 && (
        <Card>
          <Card.Header title="Past &amp; cancelled" subtitle="Your visit history" />
          <Table columns={columns(false)} data={past} />
        </Card>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Book an appointment"
        description="Choose a department, doctor, and time that works for you."
      >
        <AppointmentForm doctors={doctors} onSubmit={handleBook} onCancel={() => setModalOpen(false)} submitting={submitting} />
      </Modal>
    </div>
  );
}
