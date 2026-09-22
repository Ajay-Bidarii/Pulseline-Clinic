import { useEffect, useState } from "react";
import { Receipt, Plus, CreditCard } from "lucide-react";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { Modal } from "../components/common/Modal";
import { Table } from "../components/common/Table";
import { EmptyState } from "../components/common/EmptyState";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { Badge } from "../components/common/Badge";
import { Input, Select } from "../components/common/Input";
import { billingService } from "../services/billingService";
import { formatCurrency, formatDate } from "../utils/formatters";
import { DEPARTMENTS } from "../utils/constants";
import { useToast } from "../hooks/useToast";

function NewInvoiceForm({ onSubmit, submitting, onCancel }) {
  const [form, setForm] = useState({ patientName: "", doctorName: "", department: DEPARTMENTS[0], amount: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.patientName.trim() || !form.amount) return;
    onSubmit({ ...form, amount: Number(form.amount) });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Patient name" value={form.patientName} onChange={(e) => setForm((f) => ({ ...f, patientName: e.target.value }))} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Doctor" value={form.doctorName} onChange={(e) => setForm((f) => ({ ...f, doctorName: e.target.value }))} />
        <Select label="Department" value={form.department} onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))} options={DEPARTMENTS} />
      </div>
      <Input type="number" label="Amount (USD)" min="0" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} />
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          Create invoice
        </Button>
      </div>
    </form>
  );
}

export default function BillingPage() {
  const { notify } = useToast();
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [payingId, setPayingId] = useState(null);

  const loadData = async () => {
    const data = await billingService.getAll();
    setInvoices(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (payload) => {
    setSubmitting(true);
    try {
      await billingService.create(payload);
      notify("Invoice created.", { type: "success" });
      setModalOpen(false);
      loadData();
    } catch (err) {
      notify(err.message || "Could not create the invoice.", { type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkPaid = async (id, method) => {
    setPayingId(id);
    try {
      await billingService.pay(id, method);
      notify(`Invoice marked as paid via ${method}.`, { type: "success" });
      loadData();
    } finally {
      setPayingId(null);
    }
  };

  if (loading) return <LoadingSpinner full label="Loading invoices" />;

  const totalPending = invoices.filter((i) => i.status === "pending").reduce((sum, i) => sum + i.amount, 0);
  const totalPaid = invoices.filter((i) => i.status === "paid").reduce((sum, i) => sum + i.amount, 0);

  const columns = [
    { key: "patientName", header: "Patient" },
    { key: "doctorName", header: "Doctor" },
    { key: "department", header: "Department" },
    { key: "amount", header: "Amount", render: (row) => formatCurrency(row.amount) },
    { key: "issuedAt", header: "Issued", render: (row) => formatDate(row.issuedAt) },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <Badge tone={row.status === "paid" ? "clinic" : "amber"} dot>
          {row.status === "paid" ? `Paid via ${row.method}` : "Pending"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (row) =>
        row.status === "pending" ? (
          <div className="flex items-center gap-1.5">
            <Button size="sm" variant="outline" loading={payingId === row.id} onClick={() => handleMarkPaid(row.id, "esewa")}>
              eSewa
            </Button>
            <Button size="sm" variant="outline" loading={payingId === row.id} onClick={() => handleMarkPaid(row.id, "khalti")}>
              Khalti
            </Button>
          </div>
        ) : null,
    },
  ];

  return (
    <div className="space-y-6 animate-fadeUp">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold">Billing</h1>
          <p className="text-sm text-ink-500 mt-1">Invoices and payment status across all visits.</p>
        </div>
        <Button icon={Plus} onClick={() => setModalOpen(true)}>
          New invoice
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
            <Receipt className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-sm text-ink-500">Pending</p>
            <p className="font-display font-semibold text-ink-900">{formatCurrency(totalPending)}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-clinic-50 flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5 text-clinic-600" />
          </div>
          <div>
            <p className="text-sm text-ink-500">Collected</p>
            <p className="font-display font-semibold text-ink-900">{formatCurrency(totalPaid)}</p>
          </div>
        </Card>
      </div>

      <Card>
        <Card.Header title={`${invoices.length} invoices`} />
        <Table
          columns={columns}
          data={invoices}
          emptyState={
            <EmptyState
              icon={Receipt}
              title="No invoices yet"
              description="Create an invoice after a consultation to start tracking payments."
              action={
                <Button size="sm" icon={Plus} onClick={() => setModalOpen(true)}>
                  New invoice
                </Button>
              }
            />
          }
        />
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create an invoice" description="Bill a patient for a completed or upcoming visit.">
        <NewInvoiceForm onSubmit={handleCreate} submitting={submitting} onCancel={() => setModalOpen(false)} />
      </Modal>
    </div>
  );
}
