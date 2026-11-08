import { describe, it, expect } from "vitest";
import { parseCsv } from "../src/parser.js";
import { processIngestionJob } from "../src/ingestion.worker.js";

describe("Ingestion Worker and CSV Parser", () => {
  it("parses standard CSV text with quoted fields and commas", () => {
    const csv = `Student Name,Roll No,Date of Birth,Category,Quota,APAAR ID\n"Sharma, Aarav",2026-CSE-101,2005-04-12,GEN,"General / All India",9821-4412-1042\nPriya Patel,2026-CSE-102,2005-08-25,OBC-NCL,Home State Quota,\n`;
    const rows = parseCsv(csv);
    expect(rows.length).toBe(2);
    expect(rows[0]["Student Name"]).toBe("Sharma, Aarav");
    expect(rows[0]["Roll No"]).toBe("2026-CSE-101");
    expect(rows[0]["Category"]).toBe("GEN");
    expect(rows[0]["Quota"]).toBe("General / All India");
    expect(rows[1]["Student Name"]).toBe("Priya Patel");
  });

  it("processes ingestion job and partitions valid vs quarantined counts", async () => {
    const mockJob: any = {
      id: "job-123",
      data: {
        batchId: "batch-abc",
        institutionId: "inst-xyz",
        fileName: "test.csv",
        rows: [
          {
            studentName: "Aarav Sharma",
            rollNumber: "2026-CSE-101",
            dateOfBirth: "2005-04-12",
            category: "GEN",
            quota: "General / All India",
          },
          {
            studentName: "Invalid Student",
            rollNumber: "2026-CSE-102",
            dateOfBirth: "2005-08-25",
            category: "INVALID_CAT",
            quota: "Home State Quota",
          },
        ],
      },
      updateProgress: async (p: any) => {},
    };

    const result = await processIngestionJob(mockJob);
    expect(result.batchId).toBe("batch-abc");
    expect(result.totalCount).toBe(2);
    expect(result.validCount).toBe(1);
    expect(result.quarantineCount).toBe(1);
    expect(result.status).toBe("QUARANTINED");
  });

  it("marks status as READY_FOR_SIGN_OFF when all rows are valid", async () => {
    const mockJob: any = {
      id: "job-456",
      data: {
        batchId: "batch-clean",
        institutionId: "inst-xyz",
        fileName: "clean.csv",
        rows: [
          {
            studentName: "Aarav Sharma",
            rollNumber: "2026-CSE-101",
            dateOfBirth: "2005-04-12",
            category: "GEN",
            quota: "General / All India",
          },
        ],
      },
      updateProgress: async () => {},
    };

    const result = await processIngestionJob(mockJob);
    expect(result.status).toBe("READY_FOR_SIGN_OFF");
    expect(result.validCount).toBe(1);
    expect(result.quarantineCount).toBe(0);
  });
});
