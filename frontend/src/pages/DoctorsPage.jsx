import { useEffect, useState } from "react";
import { Plus, Stethoscope } from "lucide-react";
import { Button } from "../components/common/Button";
import { Modal } from "../components/common/Modal";
import { EmptyState } from "../components/common/EmptyState";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { Select } from "../components/common/Input";
import { DoctorCard, DoctorForm } from "../components/features/Doctors";
import { doctorService } from "../services/doctorService";
import { DEPARTMENTS } from "../utils/constants";
import { useToast } from "../hooks/useToast";

export default function DoctorsPage() {
  const { notify } = useToast();
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const [department, setDepartment] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    const data = await doctorService.getAll();
    setDoctors(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = department === "all" ? doctors : doctors.filter((d) => d.department === department);

  const handleCreate = async (payload) => {
    setSubmitting(true);
    try {
      await doctorService.create(payload);
      notify("Doctor added to the roster.", { type: "success" });
      setModalOpen(false);
      loadData();
    } catch (err) {
      notify(err.message || "Could not add the doctor.", { type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner full label="Loading care team" />;

  return (
    <div className="space-y-6 animate-fadeUp">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold">Doctors</h1>
          <p className="text-sm text-ink-500 mt-1">{doctors.length} members of your care team.</p>
        </div>
        <div className="flex items-center gap-3">
          <Select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            containerClassName="w-48"
            options={[{ value: "all", label: "All departments" }, ...DEPARTMENTS.map((d) => ({ value: d, label: d }))]}
          />
          <Button icon={Plus} onClick={() => setModalOpen(true)}>
            Add doctor
          </Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Stethoscope}
          title="No doctors in this department"
          description="Choose another department, or add a new doctor to your roster."
          action={
            <Button size="sm" icon={Plus} onClick={() => setModalOpen(true)}>
              Add doctor
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add a new doctor"
        description="Bring a new practitioner onto your care team roster."
      >
        <DoctorForm onSubmit={handleCreate} onCancel={() => setModalOpen(false)} submitting={submitting} />
      </Modal>
    </div>
  );
}
