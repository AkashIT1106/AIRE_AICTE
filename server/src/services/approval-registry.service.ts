import { getPrismaClient } from "../config/database.js";
import { ApprovalOrderInput, SeatEntitlementInput } from "@aire/validation";
import { ApprovalOrderDto } from "@aire/shared-types";
import { logAuditEvent } from "./audit.service.js";

export class ApprovalRegistryService {
  /**
   * Creates an AICTE approval order with its seat entitlements inside a transaction.
   */
  static async createApprovalOrder(
    input: ApprovalOrderInput,
    entitlements: Array<Omit<SeatEntitlementInput, "approvalOrderId">>,
    context: { actorId?: string; correlationId: string },
  ): Promise<ApprovalOrderDto> {
    const prisma = getPrismaClient();

    // Invariant check: quota arithmetic
    for (const ent of entitlements) {
      const categorySum =
        (ent.openSeats || 0) +
        (ent.scSeats || 0) +
        (ent.stSeats || 0) +
        (ent.obcSeats || 0) +
        (ent.ewsSeats || 0);
      if (categorySum > ent.sanctionedIntake) {
        throw new Error(
          `QUOTA_ARITHMETIC_ERROR: Category seats (${categorySum}) exceed sanctioned intake (${ent.sanctionedIntake}) for programme ${ent.programmeId}`,
        );
      }
    }

    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.approvalOrder.create({
        data: {
          institutionId: input.institutionId,
          academicYear: input.academicYear,
          orderNumber: input.orderNumber,
          orderType: input.orderType,
          issueDate: input.issueDate,
          status: input.status,
          supersededById: input.supersededById,
          entitlements: {
            create: entitlements.map((e) => ({
              programmeId: e.programmeId,
              campusId: e.campusId,
              sanctionedIntake: e.sanctionedIntake,
              openSeats: e.openSeats ?? 0,
              scSeats: e.scSeats ?? 0,
              stSeats: e.stSeats ?? 0,
              obcSeats: e.obcSeats ?? 0,
              ewsSeats: e.ewsSeats ?? 0,
              tfwSeats: e.tfwSeats ?? 0,
              supernumerarySeats: e.supernumerarySeats ?? 0,
            })),
          },
        },
        include: {
          entitlements: {
            include: {
              programme: true,
              campus: true,
            },
          },
        },
      });

      return createdOrder;
    });

    await logAuditEvent({
      severity: "info",
      correlationId: context.correlationId,
      actorId: context.actorId,
      tenantId: input.institutionId,
      action: "APPROVAL_ORDER_CREATED",
      resourceType: "ApprovalOrder",
      resourceId: order.id,
      status: "SUCCESS",
      metadata: {
        orderNumber: order.orderNumber,
        academicYear: order.academicYear,
        entitlementCount: entitlements.length,
      },
    });

    return ApprovalRegistryService.mapToDto(order);
  }

  /**
   * Retrieves an approval order by ID.
   */
  static async getApprovalOrder(id: string): Promise<ApprovalOrderDto | null> {
    const prisma = getPrismaClient();
    const order = await prisma.approvalOrder.findUnique({
      where: { id },
      include: {
        institution: true,
        entitlements: {
          include: {
            programme: true,
            campus: true,
          },
        },
      },
    });

    if (!order) return null;
    return ApprovalRegistryService.mapToDto(order);
  }

  /**
   * Lists approval orders with optional filters.
   */
  static async listApprovalOrders(filter?: {
    institutionId?: string;
    academicYear?: string;
    status?: string;
  }): Promise<ApprovalOrderDto[]> {
    const prisma = getPrismaClient();
    const where: any = {};

    if (filter?.institutionId) where.institutionId = filter.institutionId;
    if (filter?.academicYear) where.academicYear = filter.academicYear;
    if (filter?.status) where.status = filter.status;

    const orders = await prisma.approvalOrder.findMany({
      where,
      include: {
        entitlements: {
          include: {
            programme: true,
            campus: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return orders.map((o) => ApprovalRegistryService.mapToDto(o));
  }

  /**
   * Supersedes an active approval order with a newly issued order in a transaction.
   */
  static async supersedeApprovalOrder(
    currentOrderId: string,
    newOrderInput: ApprovalOrderInput,
    newEntitlements: Array<Omit<SeatEntitlementInput, "approvalOrderId">>,
    context: { actorId?: string; correlationId: string },
  ): Promise<ApprovalOrderDto> {
    const prisma = getPrismaClient();

    const currentOrder = await prisma.approvalOrder.findUnique({
      where: { id: currentOrderId },
    });

    if (!currentOrder) {
      throw new Error(
        `APPROVAL_ORDER_NOT_FOUND: Order ${currentOrderId} does not exist`,
      );
    }

    if (currentOrder.status === "SUPERSEDED") {
      throw new Error(
        `APPROVAL_ORDER_ALREADY_SUPERSEDED: Order ${currentOrderId} is already superseded`,
      );
    }

    // Invariant check: quota arithmetic
    for (const ent of newEntitlements) {
      const categorySum =
        (ent.openSeats || 0) +
        (ent.scSeats || 0) +
        (ent.stSeats || 0) +
        (ent.obcSeats || 0) +
        (ent.ewsSeats || 0);
      if (categorySum > ent.sanctionedIntake) {
        throw new Error(
          `QUOTA_ARITHMETIC_ERROR: Category seats (${categorySum}) exceed sanctioned intake (${ent.sanctionedIntake}) for programme ${ent.programmeId}`,
        );
      }
    }

    const supersededOrder = await prisma.$transaction(async (tx) => {
      // 1. Create the new active order
      const newOrder = await tx.approvalOrder.create({
        data: {
          institutionId: newOrderInput.institutionId,
          academicYear: newOrderInput.academicYear,
          orderNumber: newOrderInput.orderNumber,
          orderType: newOrderInput.orderType,
          issueDate: newOrderInput.issueDate,
          status: "ACTIVE",
          entitlements: {
            create: newEntitlements.map((e) => ({
              programmeId: e.programmeId,
              campusId: e.campusId,
              sanctionedIntake: e.sanctionedIntake,
              openSeats: e.openSeats ?? 0,
              scSeats: e.scSeats ?? 0,
              stSeats: e.stSeats ?? 0,
              obcSeats: e.obcSeats ?? 0,
              ewsSeats: e.ewsSeats ?? 0,
              tfwSeats: e.tfwSeats ?? 0,
              supernumerarySeats: e.supernumerarySeats ?? 0,
            })),
          },
        },
        include: {
          entitlements: {
            include: {
              programme: true,
              campus: true,
            },
          },
        },
      });

      // 2. Mark previous order as SUPERSEDED and link to new order
      await tx.approvalOrder.update({
        where: { id: currentOrderId },
        data: {
          status: "SUPERSEDED",
          supersededById: newOrder.id,
          updatedAt: new Date(),
        },
      });

      return newOrder;
    });

    await logAuditEvent({
      severity: "warn",
      correlationId: context.correlationId,
      actorId: context.actorId,
      tenantId: newOrderInput.institutionId,
      action: "APPROVAL_ORDER_SUPERSEDED",
      resourceType: "ApprovalOrder",
      resourceId: currentOrderId,
      status: "SUCCESS",
      metadata: {
        supersededOrderId: currentOrderId,
        newOrderId: supersededOrder.id,
        newOrderNumber: supersededOrder.orderNumber,
      },
    });

    return ApprovalRegistryService.mapToDto(supersededOrder);
  }

  private static mapToDto(order: any): ApprovalOrderDto {
    return {
      id: order.id,
      institutionId: order.institutionId,
      academicYear: order.academicYear,
      orderNumber: order.orderNumber,
      orderType: order.orderType,
      issueDate: order.issueDate.toISOString(),
      status: order.status,
      supersededById: order.supersededById,
      institution: order.institution
        ? {
            id: order.institution.id,
            code: order.institution.code,
            name: order.institution.name,
            aicteId: order.institution.aicteId,
            legalName: order.institution.legalName,
            status: order.institution.status,
            createdAt: order.institution.createdAt.toISOString(),
            updatedAt: order.institution.updatedAt.toISOString(),
          }
        : undefined,
      entitlements: order.entitlements?.map((e: any) => ({
        id: e.id,
        approvalOrderId: e.approvalOrderId,
        programmeId: e.programmeId,
        campusId: e.campusId,
        sanctionedIntake: e.sanctionedIntake,
        openSeats: e.openSeats,
        scSeats: e.scSeats,
        stSeats: e.stSeats,
        obcSeats: e.obcSeats,
        ewsSeats: e.ewsSeats,
        tfwSeats: e.tfwSeats,
        supernumerarySeats: e.supernumerarySeats,
        programme: e.programme
          ? {
              id: e.programme.id,
              canonicalCode: e.programme.canonicalCode,
              name: e.programme.name,
              degreeLevel: e.programme.degreeLevel,
              discipline: e.programme.discipline,
              durationYears: e.programme.durationYears,
              status: e.programme.status,
              createdAt: e.programme.createdAt.toISOString(),
              updatedAt: e.programme.updatedAt.toISOString(),
            }
          : undefined,
        campus: e.campus
          ? {
              id: e.campus.id,
              institutionId: e.campus.institutionId,
              code: e.campus.code,
              name: e.campus.name,
              status: e.campus.status,
              createdAt: e.campus.createdAt.toISOString(),
              updatedAt: e.campus.updatedAt.toISOString(),
            }
          : undefined,
        createdAt: e.createdAt.toISOString(),
        updatedAt: e.updatedAt.toISOString(),
      })),
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    };
  }
}
