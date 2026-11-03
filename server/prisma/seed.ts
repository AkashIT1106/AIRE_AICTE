import { getPrismaClient, disconnectDatabase } from "../src/config/database.js";
import { SubmissionService } from "../src/services/submission.service.js";

async function main() {
  const prisma = getPrismaClient();
  console.log("Starting deterministic AIRE demo data seed...");

  // 1. Seed Demo Institution
  const instCode = "INST-101";
  let institution = await prisma.institution.findUnique({
    where: { code: instCode },
  });

  if (!institution) {
    institution = await prisma.institution.create({
      data: {
        code: instCode,
        name: "Delhi Institute of Technology (AICTE-101)",
        status: "ACTIVE",
      },
    });
    console.log(
      `Created demo institution: ${institution.name} (${institution.id})`,
    );
  } else {
    console.log(
      `Demo institution already exists: ${institution.name} (${institution.id})`,
    );
  }

  // 2. Helper to upsert user with credentials in Better Auth account table
  async function ensureUser(email: string, name: string, role: string) {
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name,
          emailVerified: true,
        },
      });

      // Insert account credential
      await prisma.account.create({
        data: {
          accountId: email,
          providerId: "credential",
          userId: user.id,
          password: "Password123!Secure", // Dev baseline hash/password
        },
      });

      console.log(`Created demo user: ${name} <${email}>`);
    }

    // Ensure institution membership
    const existingMember = await prisma.institutionMember.findUnique({
      where: {
        institutionId_userId: {
          institutionId: institution!.id,
          userId: user.id,
        },
      },
    });

    if (!existingMember) {
      await prisma.institutionMember.create({
        data: {
          institutionId: institution!.id,
          userId: user.id,
          role,
          status: "ACTIVE",
        },
      });
      console.log(`Assigned membership: ${name} -> ${role}`);
    }

    return user;
  }

  const operatorUser = await ensureUser(
    "operator@inst101.edu",
    "Rajesh Kumar (Operator)",
    "INSTITUTION_OPERATOR",
  );

  await ensureUser(
    "admin@inst101.edu",
    "Dr. Sunita Rao (Registrar)",
    "INSTITUTION_ADMIN",
  );

  // 3. Seed Demo Admission Batch with Quarantine Records for Journey J-02
  const existingBatches = await SubmissionService.listBatches(institution.id);

  if (existingBatches.length === 0) {
    console.log(
      "Seeding initial admission batch with quarantined records for Journey J-02 triage demo...",
    );

    const demoRecords = [
      {
        studentName: "Aarav Sharma",
        rollNumber: "2026-CSE-001",
        dateOfBirth: "2005-04-12",
        category: "GEN",
        quota: "General / All India",
        apaarId: "9821-4412-1042",
      },
      {
        studentName: "Priya Patel",
        rollNumber: "2026-CSE-002",
        dateOfBirth: "2005-08-25",
        category: "OBC-NCL",
        quota: "Home State Quota",
        apaarId: "4102-8874-9821",
      },
      {
        studentName: "Rohan Verma",
        rollNumber: "2026-CSE-003",
        dateOfBirth: "2005-01-30",
        category: "SC",
        quota: "Home State Quota",
        apaarId: "3310-9921-4109",
      },
      // Defective record 1: Typo in reservation category
      {
        studentName: "Ananya Iyer",
        rollNumber: "2026-CSE-004",
        dateOfBirth: "2005-11-19",
        category: "OBC-NCL-TYPO",
        quota: "Home State Quota",
        apaarId: "7741-2290-8834",
      },
      // Defective record 2: Bad Date of Birth format
      {
        studentName: "Kunal Singhania",
        rollNumber: "2026-CSE-005",
        dateOfBirth: "15/05/2005", // Malformed (should be YYYY-MM-DD)
        category: "GEN",
        quota: "Management Quota",
        apaarId: "5512-8841-3390",
      },
    ];

    const batch = await SubmissionService.createBatch(
      institution.id,
      {
        academicYear: "2026-27",
        programme: "B.Tech Computer Science and Engineering",
        fileName: "btech_cse_admissions_round1.csv",
        records: demoRecords,
      },
      "seed-correlation-id",
      operatorUser.id,
    );

    console.log(
      `Demo batch created: ${batch.id} (${batch.validCount} valid, ${batch.quarantineCount} quarantined)`,
    );
  } else {
    console.log(
      `Demo admission batches already exist (${existingBatches.length} batches).`,
    );
  }

  console.log("Deterministic demo data seed complete!");
}

main()
  .catch((e) => {
    console.error("Seed execution failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await disconnectDatabase();
  });
