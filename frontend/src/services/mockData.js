export const mockStaff = [
  { id: "s1", name: "Admin User", email: "admin@pulseline.clinic", title: "Front Desk Admin" },
  { id: "s2", name: "Priya Basnet", email: "priya.basnet@pulseline.clinic", title: "Reception Lead" },
  { id: "s3", name: "Rohan Gurung", email: "rohan.gurung@pulseline.clinic", title: "Clinic Manager" },
];

export const mockDoctors = [
  { id: "d1", name: "Dr. Sarah Whitfield", department: "Cardiology", email: "s.whitfield@pulseline.clinic", phone: "555-0142", experience: 12, status: "available", rating: 4.9, patients: 214 },
  { id: "d2", name: "Dr. Miguel Santos", department: "Pediatrics", email: "m.santos@pulseline.clinic", phone: "555-0198", experience: 8, status: "in-consult", rating: 4.8, patients: 302 },
  { id: "d3", name: "Dr. Anika Rai", department: "General Medicine", email: "a.rai@pulseline.clinic", phone: "555-0110", experience: 6, status: "available", rating: 4.7, patients: 176 },
  { id: "d4", name: "Dr. Liam Cooper", department: "Orthopedics", email: "l.cooper@pulseline.clinic", phone: "555-0173", experience: 15, status: "off-duty", rating: 4.9, patients: 260 },
  { id: "d5", name: "Dr. Priya Nair", department: "Dermatology", email: "p.nair@pulseline.clinic", phone: "555-0164", experience: 9, status: "available", rating: 4.6, patients: 188 },
  { id: "d6", name: "Dr. James Okafor", department: "Neurology", email: "j.okafor@pulseline.clinic", phone: "555-0155", experience: 11, status: "in-consult", rating: 4.85, patients: 145 },
];

export const mockPatients = [
  { id: "p1", name: "Elena Marsh", age: 34, gender: "Female", phone: "555-2201", email: "elena.marsh@mail.com", bloodGroup: "O+", lastVisit: "2026-07-14", condition: "Hypertension", status: "active" },
  { id: "p2", name: "David Chen", age: 45, gender: "Male", phone: "555-2245", email: "d.chen@mail.com", bloodGroup: "A+", lastVisit: "2026-07-10", condition: "Type 2 Diabetes", status: "active" },
  { id: "p3", name: "Ines Torres", age: 8, gender: "Female", phone: "555-2298", email: "parent.torres@mail.com", bloodGroup: "B+", lastVisit: "2026-07-18", condition: "Seasonal allergy", status: "active" },
  { id: "p4", name: "Robert Kline", age: 62, gender: "Male", phone: "555-2312", email: "r.kline@mail.com", bloodGroup: "AB-", lastVisit: "2026-06-29", condition: "Post-op recovery", status: "monitoring" },
  { id: "p5", name: "Sofia Alvarez", age: 27, gender: "Female", phone: "555-2340", email: "s.alvarez@mail.com", bloodGroup: "O-", lastVisit: "2026-07-20", condition: "Migraine", status: "active" },
  { id: "p6", name: "Tomas Lindqvist", age: 51, gender: "Male", phone: "555-2377", email: "t.lindqvist@mail.com", bloodGroup: "A-", lastVisit: "2026-05-30", condition: "Chronic back pain", status: "discharged" },
  { id: "p7", name: "Aiko Tanaka", age: 19, gender: "Female", phone: "555-2390", email: "aiko.t@mail.com", bloodGroup: "B-", lastVisit: "2026-07-21", condition: "Skin consultation", status: "active" },
];

const today = new Date();
function dayOffset(days, hour, minute = 0) {
  const d = new Date(today);
  d.setDate(d.getDate() + days);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

export const mockAppointments = [
  { id: "a1", patientName: "Elena Marsh", doctorName: "Dr. Sarah Whitfield", department: "Cardiology", datetime: dayOffset(0, 9, 0), status: "confirmed", reason: "Follow-up: blood pressure review" },
  { id: "a2", patientName: "David Chen", doctorName: "Dr. Anika Rai", department: "General Medicine", datetime: dayOffset(0, 10, 30), status: "confirmed", reason: "Quarterly glucose check" },
  { id: "a3", patientName: "Ines Torres", doctorName: "Dr. Miguel Santos", department: "Pediatrics", datetime: dayOffset(0, 13, 0), status: "pending", reason: "Allergy symptoms" },
  { id: "a4", patientName: "Sofia Alvarez", doctorName: "Dr. James Okafor", department: "Neurology", datetime: dayOffset(1, 11, 0), status: "confirmed", reason: "Migraine pattern review" },
  { id: "a5", patientName: "Robert Kline", doctorName: "Dr. Liam Cooper", department: "Orthopedics", datetime: dayOffset(1, 15, 30), status: "pending", reason: "Post-op check-in" },
  { id: "a6", patientName: "Aiko Tanaka", doctorName: "Dr. Priya Nair", department: "Dermatology", datetime: dayOffset(2, 9, 30), status: "confirmed", reason: "Skin patch consultation" },
  { id: "a7", patientName: "Tomas Lindqvist", doctorName: "Dr. Liam Cooper", department: "Orthopedics", datetime: dayOffset(-1, 14, 0), status: "completed", reason: "Physiotherapy assessment", diagnosis: "Chronic lumbar strain", prescription: "Ibuprofen 400mg twice daily (5 days); physiotherapy 2x/week for 4 weeks.", notes: "Patient responding well to prior treatment plan." },
  { id: "a8", patientName: "David Chen", doctorName: "Dr. Sarah Whitfield", department: "Cardiology", datetime: dayOffset(-2, 10, 0), status: "cancelled", reason: "ECG review" },
];

export const mockServices = [
  { slug: "primary-care", name: "Primary Care", department: "General Medicine", price: 40, duration: "30 min", description: "Routine checkups, screenings, and ongoing management of everyday health concerns for the whole family." },
  { slug: "cardiac-consultation", name: "Cardiac Consultation", department: "Cardiology", price: 85, duration: "45 min", description: "Heart health assessments, ECG review, and blood pressure management with our cardiology team." },
  { slug: "pediatric-visit", name: "Pediatric Visit", department: "Pediatrics", price: 45, duration: "30 min", description: "Growth checks, vaccinations, and care for childhood illnesses in a calm, kid-friendly setting." },
  { slug: "orthopedic-assessment", name: "Orthopedic Assessment", department: "Orthopedics", price: 70, duration: "40 min", description: "Joint, bone, and muscle evaluations, including post-operative and physiotherapy follow-up." },
  { slug: "skin-consultation", name: "Skin Consultation", department: "Dermatology", price: 60, duration: "30 min", description: "Diagnosis and treatment for skin, hair, and nail conditions, from acne to patch testing." },
  { slug: "neurology-review", name: "Neurology Review", department: "Neurology", price: 95, duration: "45 min", description: "Evaluation of headaches, migraines, and neurological symptoms with a tailored care plan." },
];

export const mockInvoices = [
  { id: "inv1", appointmentId: "a7", patientName: "Tomas Lindqvist", doctorName: "Dr. Liam Cooper", department: "Orthopedics", amount: 70, status: "paid", method: "esewa", issuedAt: dayOffset(-1, 15, 0) },
  { id: "inv2", appointmentId: "a8", patientName: "David Chen", doctorName: "Dr. Sarah Whitfield", department: "Cardiology", amount: 85, status: "pending", method: null, issuedAt: dayOffset(-2, 11, 0) },
];
