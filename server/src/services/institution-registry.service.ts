import { getPrismaClient, withTenantContext } from "../config/database.js";
import {
  InstitutionProfile,
  CampusInput,
  ProgrammeInput,
  ProgrammeAliasInput,
} from "@aire/validation";
import {
  InstitutionDto,
  CampusDto,
  ProgrammeDto,
  ProgrammeAliasDto,
} from "@aire/shared-types";
import { logAuditEvent } from "./audit.service.js";

export class InstitutionRegistryService {
  /**
   * Retrieves an institution by ID including its active campuses.
   */
  static async getInstitution(id: string): Promise<InstitutionDto | null> {
    const prisma = getPrismaClient();
    const inst = await prisma.institution.findUnique({
      where: { id },
      include: {
        campuses: {
          orderBy: { code: "asc" },
        },
      },
    });

    if (!inst) return null;

    return {
      id: inst.id,
      code: inst.code,
      name: inst.name,
      aicteId: inst.aicteId,
      legalName: inst.legalName,
      address: inst.address,
      state: inst.state,
      district: inst.district,
      pincode: inst.pincode,
      status: inst.status,
      campuses: inst.campuses.map((c) => ({
        id: c.id,
        institutionId: c.institutionId,
        code: c.code,
        name: c.name,
        address: c.address,
        state: c.state,
        district: c.district,
        pincode: c.pincode,
        status: c.status,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
      })),
      createdAt: inst.createdAt.toISOString(),
      updatedAt: inst.updatedAt.toISOString(),
    };
  }

  /**
   * Lists institutions with optional filters.
   */
  static async listInstitutions(filter?: {
    state?: string;
    status?: string;
    search?: string;
  }): Promise<InstitutionDto[]> {
    const prisma = getPrismaClient();
    const where: any = {};

    if (filter?.state) where.state = filter.state;
    if (filter?.status) where.status = filter.status;
    if (filter?.search) {
      where.OR = [
        { name: { contains: filter.search, mode: "insensitive" } },
        { code: { contains: filter.search, mode: "insensitive" } },
        { aicteId: { contains: filter.search, mode: "insensitive" } },
      ];
    }

    const institutions = await prisma.institution.findMany({
      where,
      orderBy: { name: "asc" },
    });

    return institutions.map((inst) => ({
      id: inst.id,
      code: inst.code,
      name: inst.name,
      aicteId: inst.aicteId,
      legalName: inst.legalName,
      address: inst.address,
      state: inst.state,
      district: inst.district,
      pincode: inst.pincode,
      status: inst.status,
      createdAt: inst.createdAt.toISOString(),
      updatedAt: inst.updatedAt.toISOString(),
    }));
  }

  /**
   * Updates institution profile with audit trail.
   */
  static async updateInstitution(
    id: string,
    input: InstitutionProfile,
    context: { actorId?: string; correlationId: string; tenantId?: string },
  ): Promise<InstitutionDto> {
    const prisma = getPrismaClient();

    const updated = await prisma.institution.update({
      where: { id },
      data: {
        ...input,
        updatedAt: new Date(),
      },
    });

    await logAuditEvent({
      severity: "info",
      correlationId: context.correlationId,
      actorId: context.actorId,
      tenantId: context.tenantId || id,
      action: "INSTITUTION_PROFILE_UPDATED",
      resourceType: "Institution",
      resourceId: id,
      status: "SUCCESS",
      metadata: { updatedFields: Object.keys(input) },
    });

    return {
      id: updated.id,
      code: updated.code,
      name: updated.name,
      aicteId: updated.aicteId,
      legalName: updated.legalName,
      address: updated.address,
      state: updated.state,
      district: updated.district,
      pincode: updated.pincode,
      status: updated.status,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
  }

  /**
   * Creates a campus under an institution with tenant boundary enforcement.
   */
  static async createCampus(
    institutionId: string,
    input: CampusInput,
    context: { actorId?: string; correlationId: string; tenantId?: string },
  ): Promise<CampusDto> {
    const campus = await withTenantContext(institutionId, async (tx) => {
      return tx.campus.create({
        data: {
          institutionId,
          code: input.code,
          name: input.name,
          address: input.address,
          state: input.state,
          district: input.district,
          pincode: input.pincode,
          status: input.status,
        },
      });
    });

    await logAuditEvent({
      severity: "info",
      correlationId: context.correlationId,
      actorId: context.actorId,
      tenantId: context.tenantId || institutionId,
      action: "CAMPUS_CREATED",
      resourceType: "Campus",
      resourceId: campus.id,
      status: "SUCCESS",
      metadata: { code: input.code, name: input.name },
    });

    return {
      id: campus.id,
      institutionId: campus.institutionId,
      code: campus.code,
      name: campus.name,
      address: campus.address,
      state: campus.state,
      district: campus.district,
      pincode: campus.pincode,
      status: campus.status,
      createdAt: campus.createdAt.toISOString(),
      updatedAt: campus.updatedAt.toISOString(),
    };
  }

  /**
   * Lists campuses belonging to a specific institution.
   */
  static async listCampuses(institutionId: string): Promise<CampusDto[]> {
    return withTenantContext(institutionId, async (tx) => {
      const campuses = await tx.campus.findMany({
        where: { institutionId },
        orderBy: { code: "asc" },
      });

      return campuses.map((c) => ({
        id: c.id,
        institutionId: c.institutionId,
        code: c.code,
        name: c.name,
        address: c.address,
        state: c.state,
        district: c.district,
        pincode: c.pincode,
        status: c.status,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
      }));
    });
  }

  /**
   * Lists canonical AICTE programmes.
   */
  static async listProgrammes(filter?: {
    discipline?: string;
    degreeLevel?: string;
    status?: string;
  }): Promise<ProgrammeDto[]> {
    const prisma = getPrismaClient();
    const where: any = {};

    if (filter?.discipline) where.discipline = filter.discipline;
    if (filter?.degreeLevel) where.degreeLevel = filter.degreeLevel;
    if (filter?.status) where.status = filter.status;

    const programmes = await prisma.programme.findMany({
      where,
      orderBy: { canonicalCode: "asc" },
    });

    return programmes.map((p) => ({
      id: p.id,
      canonicalCode: p.canonicalCode,
      name: p.name,
      degreeLevel: p.degreeLevel,
      discipline: p.discipline,
      durationYears: p.durationYears,
      status: p.status,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }));
  }

  /**
   * Creates a canonical programme with audit logging.
   */
  static async createProgramme(
    input: ProgrammeInput,
    context: { actorId?: string; correlationId: string },
  ): Promise<ProgrammeDto> {
    const prisma = getPrismaClient();
    const prog = await prisma.programme.create({
      data: input,
    });

    await logAuditEvent({
      severity: "info",
      correlationId: context.correlationId,
      actorId: context.actorId,
      action: "PROGRAMME_CREATED",
      resourceType: "Programme",
      resourceId: prog.id,
      status: "SUCCESS",
      metadata: { canonicalCode: prog.canonicalCode, name: prog.name },
    });

    return {
      id: prog.id,
      canonicalCode: prog.canonicalCode,
      name: prog.name,
      degreeLevel: prog.degreeLevel,
      discipline: prog.discipline,
      durationYears: prog.durationYears,
      status: prog.status,
      createdAt: prog.createdAt.toISOString(),
      updatedAt: prog.updatedAt.toISOString(),
    };
  }

  /**
   * Matches a raw reported programme title against canonical programmes or aliases.
   */
  static async matchProgrammeAlias(
    rawTitle: string,
    institutionId?: string,
  ): Promise<{ programme: ProgrammeDto | null; confidence: number; matchedBy: "EXACT" | "ALIAS" | "NONE" }> {
    const prisma = getPrismaClient();
    const normalised = rawTitle.toLowerCase().replace(/[^a-z0-9]/g, " ").replace(/\s+/g, " ").trim();

    // 1. Direct exact name match on canonical programme
    const exactProg = await prisma.programme.findFirst({
      where: {
        OR: [
          { name: { equals: rawTitle, mode: "insensitive" } },
          { canonicalCode: { equals: rawTitle, mode: "insensitive" } },
        ],
      },
    });

    if (exactProg) {
      return {
        programme: {
          id: exactProg.id,
          canonicalCode: exactProg.canonicalCode,
          name: exactProg.name,
          degreeLevel: exactProg.degreeLevel,
          discipline: exactProg.discipline,
          durationYears: exactProg.durationYears,
          status: exactProg.status,
          createdAt: exactProg.createdAt.toISOString(),
          updatedAt: exactProg.updatedAt.toISOString(),
        },
        confidence: 1.0,
        matchedBy: "EXACT",
      };
    }

    // 2. Check registered programme aliases
    const aliasWhere: any = { normalisedTitle: normalised };
    if (institutionId) {
      aliasWhere.OR = [
        { institutionId },
        { institutionId: null },
      ];
    }

    const alias = await prisma.programmeAlias.findFirst({
      where: aliasWhere,
      include: { programme: true },
      orderBy: { confidence: "desc" },
    });

    if (alias && alias.programme) {
      return {
        programme: {
          id: alias.programme.id,
          canonicalCode: alias.programme.canonicalCode,
          name: alias.programme.name,
          degreeLevel: alias.programme.degreeLevel,
          discipline: alias.programme.discipline,
          durationYears: alias.programme.durationYears,
          status: alias.programme.status,
          createdAt: alias.programme.createdAt.toISOString(),
          updatedAt: alias.programme.updatedAt.toISOString(),
        },
        confidence: alias.confidence,
        matchedBy: "ALIAS",
      };
    }

    return { programme: null, confidence: 0, matchedBy: "NONE" };
  }

  /**
   * Registers a programme alias for normalisation.
   */
  static async createProgrammeAlias(
    input: ProgrammeAliasInput,
    context: { actorId?: string; correlationId: string },
  ): Promise<ProgrammeAliasDto> {
    const prisma = getPrismaClient();
    const normalised =
      input.normalisedTitle ||
      input.rawTitle.toLowerCase().replace(/[^a-z0-9]/g, " ").replace(/\s+/g, " ").trim();

    const alias = await prisma.programmeAlias.create({
      data: {
        programmeId: input.programmeId,
        rawTitle: input.rawTitle,
        normalisedTitle: normalised,
        institutionId: input.institutionId,
        confidence: input.confidence ?? 1.0,
      },
    });

    await logAuditEvent({
      severity: "info",
      correlationId: context.correlationId,
      actorId: context.actorId,
      action: "PROGRAMME_ALIAS_CREATED",
      resourceType: "ProgrammeAlias",
      resourceId: alias.id,
      status: "SUCCESS",
      metadata: { rawTitle: input.rawTitle, normalisedTitle: normalised },
    });

    return {
      id: alias.id,
      programmeId: alias.programmeId,
      rawTitle: alias.rawTitle,
      normalisedTitle: alias.normalisedTitle,
      institutionId: alias.institutionId,
      confidence: alias.confidence,
      createdAt: alias.createdAt.toISOString(),
      updatedAt: alias.updatedAt.toISOString(),
    };
  }
}
