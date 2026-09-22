import { useEffect, useState } from "react";
import { UserPlus, ListOrdered, Trash2, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { Modal } from "../components/common/Modal";
import { Badge } from "../components/common/Badge";
import { EmptyState } from "../components/common/EmptyState";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { Input, Select } from "../components/common/Input";
import { queueService } from "../services/queueService";
import { doctorService } from "../services/doctorService";
import { formatTime } from "../utils/formatters";
import { ROUTES } from "../utils/constants";
import { useToast } from "../hooks/useToast";

const statusTone = { waiting: "amber", "in-consult": "clinic", done: "neutral" };
const statusLabel = { waiting: "Waiting", "in-consult": "In consultation", done: "Done" };

function CheckInForm({ doctors, onSubmit, submitting }) {
  const [form, setForm] = useState({ patientName: "", doctorName: doctors[0]?.name || "", department: doctors[0]?.department || "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.patientName.trim()) return;
    onSubmit(form);
    setForm((f) => ({ ...f, patientName: "" }));
  };

  const handleDoctorChange = (e) => {
    const doc = doctors.find((d) => d.name === e.target.value);
    setForm((f) => ({ ...f, doctorName: e.target.value, department: doc?.department || f.department }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Patient name"
        placeholder="Walk-in patient's full name"
        value={form.patientName}
        onChange={(e) => setForm((f) => ({ ...f, patientName: e.target.value }))}
      />
      <Select label="Assign to doctor" value={form.doctorName} onChange={handleDoctorChange} options={doctors.map((d) => d.name)} />
      <Button type="submit" className="w-full" icon={UserPlus} loading={submitting}>
        Check in
      </Button>
    </form>
  );
}

export default function QueuePage() {
  const { notify } = useToast();
  const [loading, setLoading] = useState(true);
  const [queue, setQueue] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    const [q, docs] = await Promise.all([queueService.getQueue(), doctorService.getAll()]);
    setQueue(q);
    setDoctors(docs);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(() => queueService.getQueue().then(setQueue), 4000);
    return () => clearInterval(interval);
  }, []);

  const handleCheckIn = async (payload) => {
    setSubmitting(true);
    try {
      await queueService.checkIn(payload);
      notify("Patient checked in to the queue.", { type: "success" });
      setModalOpen(false);
      loadData();
    } catch (err) {
      notify(err.message || "Could not check in this patient.", { type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async (id) => {
    await queueService.remove(id);
    setQueue((current) => current.filter((entry) => entry.id !== id));
  };

  if (loading) return <LoadingSpinner full label="Loading the waiting queue" />;

  const active = queue.filter((entry) => entry.status !== "done");

  return (
    <div className="space-y-6 animate-fadeUp">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold">Waiting queue</h1>
          <p className="text-sm text-ink-500 mt-1">Check in walk-ins and track who's waiting for which doctor.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to={ROUTES.QUEUE_DISPLAY} target="_blank" rel="noreferrer">
            <Button variant="outline" icon={ExternalLink}>
              Open waiting room screen
            </Button>
          </Link>
          <Button icon={UserPlus} onClick={() => setModalOpen(true)}>
            Check in walk-in
          </Button>
        </div>
      </div>

      <Card>
        <Card.Header title={`${active.length} in queue`} subtitle="Refreshes automatically every few seconds" />
        {active.length === 0 ? (
          <EmptyState icon={ListOrdered} title="Queue is empty" description="Check in a walk-in patient to add them to the line." />
        ) : (
          <div className="space-y-2">
            {active.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between gap-4 p-3.5 rounded-xl border border-ink-100"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-lg bg-clinic-50 flex items-center justify-center font-display font-semibold text-clinic-700 shrink-0">
                    {entry.token}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-ink-900 truncate">{entry.patientName}</p>
                    <p className="text-xs text-ink-500 truncate">
                      {entry.doctorName} &middot; {entry.department} &middot; checked in {formatTime(entry.checkedInAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Badge tone={statusTone[entry.status]} dot>
                    {statusLabel[entry.status]}
                  </Badge>
                  <button onClick={() => handleRemove(entry.id)} className="p-1.5 rounded-lg text-coral-600 hover:bg-coral-100">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Check in a walk-in patient" description="Adds them to the live waiting queue.">
        <CheckInForm doctors={doctors} onSubmit={handleCheckIn} submitting={submitting} />
      </Modal>
    </div>
  );
}
