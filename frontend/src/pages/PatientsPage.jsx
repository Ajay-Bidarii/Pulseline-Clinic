import { useEffect, useMemo, useState } from "react";
import { Plus, Search, UserRoundX, Trash2 } from "lucide-react";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { Table } from "../components/common/Table";
import { Modal } from "../components/common/Modal";
import { EmptyState } from "../components/common/EmptyState";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { PatientForm, PatientStatusBadge } from "../components/features/Patients";
import { patientService } from "../services/patientService";
import { formatDate, initials } from "../utils/formatters";
import { useToast } from "../hooks/useToast";

export default function PatientsPage() {
  const { notify } = useToast();
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState([]);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    const data = await patientService.getAll();
    setPatients(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return patients;
    const q = query.toLowerCase();
    return patients.filter(
      (p) => p.name.toLowerCase().includes(q) || p.condition.toLowerCase().includes(q) || p.phone.includes(q)
    );
  }, [patients, query]);

  const handleCreate = async (payload) => {
    setSubmitting(true);
    try {
      await patientService.create(payload);
      notify("Patient added to records.", { type: "success" });
      setModalOpen(false);
      loadData();
    } catch (err) {
      notify(err.message || "Could not add the patient.", { type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    await patientService.remove(id);
    setPatients((current) => current.filter((p) => p.id !== id));
    notify("Patient record removed.", { type: "info" });
  };

  if (loading) return <LoadingSpinner full label="Loading patient records" />;

  const columns = [
    {
      key: "name",
      header: "Patient",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-clinic-100 text-clinic-700 flex items-center justify-center text-xs font-semibold shrink-0">
            {initials(row.name)}
          </div>
          <div>
            <p className="font-medium text-ink-900">{row.name}</p>
            <p className="text-xs text-ink-500">
              {row.age} yrs &middot; {row.gender}
            </p>
          </div>
        </div>
      ),
    },
    { key: "condition", header: "Condition" },
    { key: "bloodGroup", header: "Blood group" },
    { key: "phone", header: "Phone" },
    { key: "lastVisit", header: "Last visit", render: (row) => formatDate(row.lastVisit) },
    { key: "status", header: "Status", render: (row) => <PatientStatusBadge status={row.status} /> },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <button
          title="Remove patient"
          onClick={() => handleDelete(row.id)}
          className="p-1.5 rounded-lg text-coral-600 hover:bg-coral-100"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fadeUp">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold">Patients</h1>
          <p className="text-sm text-ink-500 mt-1">{patients.length} records on file.</p>
        </div>
        <Button icon={Plus} onClick={() => setModalOpen(true)}>
          Add patient
        </Button>
      </div>

      <Card>
        <div className="flex items-center gap-2 bg-surface-sunken rounded-lg px-3 py-2.5 mb-5 max-w-sm">
          <Search className="w-4 h-4 text-ink-300" />
          <input
            placeholder="Search by name, condition, or phone"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent outline-none text-sm w-full placeholder:text-ink-300"
          />
        </div>
        <Table
          columns={columns}
          data={filtered}
          emptyState={
            <EmptyState
              icon={UserRoundX}
              title="No matching patients"
              description="Adjust your search, or add a new patient to begin their record."
              action={
                <Button size="sm" icon={Plus} onClick={() => setModalOpen(true)}>
                  Add patient
                </Button>
              }
            />
          }
        />
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add a new patient"
        description="Create a record to start scheduling visits and tracking history."
      >
        <PatientForm onSubmit={handleCreate} onCancel={() => setModalOpen(false)} submitting={submitting} />
      </Modal>
    </div>
  );
}
