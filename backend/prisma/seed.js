import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function hash(pw) {
  return bcrypt.hash(pw, 12);
}

async function main() {
  console.log("Seeding departments...");
  const departmentNames = [
    "General Medicine",
    "Pediatrics",
    "Cardiology",
    "Orthopedics",
    "Dermatology",
    "Gynecology",
    "ENT",
    "Neurology",
  ];
  const departments = {};
  for (const name of departmentNames) {
    departments[name] = await prisma.department.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log("Seeding staff...");
  await prisma.user.upsert({
    where: { email: "admin@pulseline.clinic" },
    update: {},
    create: {
      fullName: "Admin User",
      email: "admin@pulseline.clinic",
      password: await hash("password123"),
      role: "ADMIN",
      isEmailVerified: true,
    },
  });

  console.log("Seeding doctors...");
  const doctorSeed = [
    { name: "Dr. Sarah Whitfield", email: "s.whitfield@pulseline.clinic", department: "Cardiology" },
    { name: "Dr. Miguel Santos", email: "m.santos@pulseline.clinic", department: "Pediatrics" },
    { name: "Dr. Anika Rai", email: "a.rai@pulseline.clinic", department: "General Medicine" },
    { name: "Dr. Liam Cooper", email: "l.cooper@pulseline.clinic", department: "Orthopedics" },
    { name: "Dr. Priya Nair", email: "p.nair@pulseline.clinic", department: "Dermatology" },
    { name: "Dr. James Okafor", email: "j.okafor@pulseline.clinic", department: "Neurology" },
  ];

  for (const doc of doctorSeed) {
    const user = await prisma.user.upsert({
      where: { email: doc.email },
      update: {},
      create: {
        fullName: doc.name,
        email: doc.email,
        password: await hash("password123"),
        role: "DOCTOR",
        isEmailVerified: true,
      },
    });
    await prisma.doctor.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        departmentId: departments[doc.department].id,
        qualifications: ["MBBS", "MD"],
      },
    });
  }

  console.log("Seeded. Demo logins use password: password123");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
