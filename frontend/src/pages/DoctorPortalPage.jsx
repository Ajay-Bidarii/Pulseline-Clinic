import { useEffect, useState } from "react";
import { PhoneCall, Stethoscope, ClipboardList } from "lucide-react";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { Modal } from "../components/common/Modal";
import { Table } from "../components/common/Table";
import { EmptyState } from "../components/common/EmptyState";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { StatusBadge } from "../components/features/Appointments";
import { PrescriptionForm } from "../components/features/Doctors";
import { appointmentService } from "../services/appointmentService";
import { patientService } from "../services/patientService";
import { queueService } from "../services/queueService";
import { formatDateTime } from "../utils/formatters";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";

export default function DoctorPortalPage() {
  const { user } = useAuth();
  const { notify } = useToast();
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [queue, setQueue] = useState([]);
  const [active, setActive] = useState(null);
  const [saving, setSaving] = useState(false);
  const [callingNext, setCallingNext] = useState(false);

  const loadData = async () => {
    const [mine, allPatients, fullQueue] = await Promise.all([
      appointmentService.getByDoctorName(user?.name),
      patientService.getAll(),
      queueService.getQueue(),
    ]);
    setAppointments(mine);
    setPatients(allPatients);
    setQueue(fullQueue);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.name]);

  const handleCallNext = async () => {
    setCallingNext(true);
    try {
      const next = await queueService.callNext(user?.name);
      const refreshed = await queueService.getQueue();
      setQueue(refreshed);
      notify(next ? `${next.patientName} called in — token ${next.token}.` : "No one else is waiting.", {
        type: next ? "success" : "info",
      });
    } finally {
      setCallingNext(false);
    }
  };

  const handleSavePrescription = async (values) => {
    setSaving(true);
    try {
      await appointmentService.addPrescription(active.id, values);
      notify("Consultation notes saved.", { type: "success" });
      setActive(null);
      loadData();
    } catch (err) {
      notify(err.message || "Could not save the notes.", { type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner full label="Loading your schedule" />;

  const today = new Date().toDateString();
  const todaysVisits = appointments.filter(
    (a) => new Date(a.datetime).toDateString() === today && a.status !== "cancelled"
  );
  const inConsult = queue.find((q) => q.doctorName === user?.name && q.status === "in-consult");
  const waitingForMe = queue.filter((q) => q.doctorName === user?.name && q.status === "waiting");

  const patientRecord = (name) => patients.find((p) => p.name.toLowerCase() === name.toLowerCase());

  const columns = [
    { key: "patientName", header: "Patient" },
    { key: "datetime", header: "Time", render: (row) => formatDateTime(row.datetime) },
    { key: "reason", header: "Reason" },
    { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <Button size="sm" variant="outline" icon={ClipboardList} onClick={() => setActive(row)}>
          {row.status === "completed" ? "View notes" : "Add notes"}
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fadeUp">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold">Welcome, {user?.name}</h1>
          <p className="text-sm text-ink-500 mt-1">{user?.department} &middot; {todaysVisits.length} visits today</p>
        </div>
        <Button icon={PhoneCall} onClick={handleCallNext} loading={callingNext}>
          Call next patient
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-clinic-50 flex items-center justify-center shrink-0">
            <Stethoscope className="w-5 h-5 text-clinic-600" />
          </div>
          <div>
            <p className="text-sm text-ink-500">Currently in consultation</p>
            <p className="font-display font-semibold text-ink-900">{inConsult ? inConsult.patientName : "No patient — room is free"}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
            <span className="font-display font-semibold text-amber-600">{waitingForMe.length}</span>
          </div>
          <div>
            <p className="text-sm text-ink-500">Waiting in queue</p>
            <p className="font-display font-semibold text-ink-900">
              {waitingForMe.length ? waitingForMe.map((w) => w.patientName).join(", ") : "No one waiting"}
            </p>
          </div>
        </Card>
      </div>

      <Card>
        <Card.Header title="Today's schedule" subtitle="Your confirmed and completed appointments" />
        <Table
          columns={columns}
          data={todaysVisits}
          emptyState={<EmptyState icon={Stethoscope} title="No visits today" description="Enjoy the quiet — nothing on your schedule for today." />}
        />
      </Card>

      <Modal
        open={!!active}
        onClose={() => setActive(null)}
        title={active?.patientName}
        description={
          active
            ? `${active.reason} — ${formatDateTime(active.datetime)}${
                patientRecord(active.patientName)
                  ? ` — ${patientRecord(active.patientName).age} yrs, ${patientRecord(active.patientName).bloodGroup}`
                  : ""
              }`
            : ""
        }
        size="lg"
      >
        {active && <PrescriptionForm appointment={active} onSave={handleSavePrescription} onCancel={() => setActive(null)} saving={saving} />}
      </Modal>
    </div>
  );
}
