import { useEffect, useMemo, useState } from "react";
import { Plus, CalendarX2, Check, X as XIcon, Trash2 } from "lucide-react";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { Table } from "../components/common/Table";
import { Modal } from "../components/common/Modal";
import { EmptyState } from "../components/common/EmptyState";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { Select } from "../components/common/Input";
import { AppointmentForm, StatusBadge } from "../components/features/Appointments";
import { appointmentService } from "../services/appointmentService";
import { doctorService } from "../services/doctorService";
import { formatDateTime } from "../utils/formatters";
import { useToast } from "../hooks/useToast";

export default function AppointmentsPage() {
  const { notify } = useToast();
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  const loadData = async () => {
    const [appts, docs] = await Promise.all([appointmentService.getAll(), doctorService.getAll()]);
    setAppointments(appts);
    setDoctors(docs);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = useMemo(() => {
    if (statusFilter === "all") return appointments;
    return appointments.filter((a) => a.status === statusFilter);
  }, [appointments, statusFilter]);

  const handleCreate = async (payload) => {
    setSubmitting(true);
    try {
      await appointmentService.create(payload);
      notify("Appointment booked successfully.", { type: "success" });
      setModalOpen(false);
      loadData();
    } catch (err) {
      notify(err.message || "Could not book the appointment.", { type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatus = async (id, status) => {
    await appointmentService.updateStatus(id, status);
    setAppointments((current) => current.map((a) => (a.id === id ? { ...a, status } : a)));
    notify(`Appointment marked as ${status}.`, { type: status === "cancelled" ? "warning" : "success" });
  };

  const handleDelete = async (id) => {
    await appointmentService.remove(id);
    setAppointments((current) => current.filter((a) => a.id !== id));
    notify("Appointment removed.", { type: "info" });
  };

  if (loading) return <LoadingSpinner full label="Loading appointments" />;

  const columns = [
    { key: "patientName", header: "Patient" },
    { key: "doctorName", header: "Doctor" },
    { key: "department", header: "Department" },
    { key: "datetime", header: "Scheduled", render: (row) => formatDateTime(row.datetime) },
    { key: "reason", header: "Reason" },
    { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <div className="flex items-center gap-1.5 justify-end">
          {row.status === "pending" && (
            <button
              title="Confirm"
              onClick={() => handleStatus(row.id, "confirmed")}
              className="p-1.5 rounded-lg text-clinic-600 hover:bg-clinic-50"
            >
              <Check className="w-4 h-4" />
            </button>
          )}
          {row.status !== "cancelled" && row.status !== "completed" && (
            <button
              title="Cancel"
              onClick={() => handleStatus(row.id, "cancelled")}
              className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-100"
            >
              <XIcon className="w-4 h-4" />
            </button>
          )}
          <button
            title="Delete"
            onClick={() => handleDelete(row.id)}
            className="p-1.5 rounded-lg text-coral-600 hover:bg-coral-100"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fadeUp">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold">Appointments</h1>
          <p className="text-sm text-ink-500 mt-1">Manage bookings across every department.</p>
        </div>
        <Button icon={Plus} onClick={() => setModalOpen(true)}>
          New appointment
        </Button>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
          <Card.Header title={`${filtered.length} appointments`} className="mb-0" />
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            containerClassName="w-48"
            options={[
              { value: "all", label: "All statuses" },
              { value: "confirmed", label: "Confirmed" },
              { value: "pending", label: "Awaiting confirmation" },
              { value: "completed", label: "Completed" },
              { value: "cancelled", label: "Cancelled" },
            ]}
          />
        </div>
        <Table
          columns={columns}
          data={filtered}
          emptyState={
            <EmptyState
              icon={CalendarX2}
              title="No appointments found"
              description="Try a different filter, or book a new appointment to get started."
              action={
                <Button size="sm" icon={Plus} onClick={() => setModalOpen(true)}>
                  New appointment
                </Button>
              }
            />
          }
        />
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Book a new appointment"
        description="Schedule a visit for a patient with an available doctor."
      >
        <AppointmentForm doctors={doctors} onSubmit={handleCreate} onCancel={() => setModalOpen(false)} submitting={submitting} />
      </Modal>
    </div>
  );
}
