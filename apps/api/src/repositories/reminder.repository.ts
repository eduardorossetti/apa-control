import { db } from '@/database/client'
import { animal, appointment, campaign, clinicalProcedure, financialTransaction, reminder } from '@/database/schema'
import { AppointmentStatus } from '@/database/schema/enums/appointment-status'
import { CampaignStatus } from '@/database/schema/enums/campaign-status'
import { ProcedureStatus } from '@/database/schema/enums/procedure-status'
import { ReminderEntityType, type ReminderEntityTypeValue } from '@/database/schema/enums/reminder-entity-type'
import { TransactionStatus } from '@/database/schema/enums/transaction-status'
import type { DrizzleTransaction } from '@/database/types'
import type { Reminder } from '@/entities'
import type { ListRemindersData, ReminderWithDetails } from '@/use-cases/reminder/list-reminders/list-reminders.dto'
import { and, asc, desc, eq, gte, inArray, isNotNull, isNull, lte, or, sql } from 'drizzle-orm'

export class ReminderRepository {
  async purgeInvalidReminders() {
    await db.execute(sql`
      DELETE FROM reminder r
      WHERE (
        r.entity_type = ${ReminderEntityType.APPOINTMENT}
        AND (
          NOT EXISTS (SELECT 1 FROM appointment a WHERE a.id = r.entity_id)
          OR EXISTS (
            SELECT 1 FROM appointment a
            WHERE a.id = r.entity_id
              AND a.status IN (${AppointmentStatus.COMPLETED}, ${AppointmentStatus.CANCELLED})
          )
        )
      )
      OR (
        r.entity_type = ${ReminderEntityType.PROCEDURE}
        AND (
          NOT EXISTS (SELECT 1 FROM clinical_procedure cp WHERE cp.id = r.entity_id)
          OR EXISTS (
            SELECT 1 FROM clinical_procedure cp
            WHERE cp.id = r.entity_id
              AND cp.status IN (${ProcedureStatus.COMPLETED}, ${ProcedureStatus.CANCELLED})
          )
        )
      )
      OR (
        r.entity_type = ${ReminderEntityType.FINANCIAL_TRANSACTION}
        AND (
          NOT EXISTS (SELECT 1 FROM financial_transaction ft WHERE ft.id = r.entity_id)
          OR EXISTS (
            SELECT 1 FROM financial_transaction ft
            WHERE ft.id = r.entity_id
              AND (ft.status <> ${TransactionStatus.PENDING} OR ft.due_date IS NULL)
          )
        )
      )
      OR (
        r.entity_type = ${ReminderEntityType.CAMPAIGN}
        AND (
          NOT EXISTS (SELECT 1 FROM campaign c WHERE c.id = r.entity_id)
          OR EXISTS (
            SELECT 1 FROM campaign c
            WHERE c.id = r.entity_id
              AND c.status IN (${CampaignStatus.COMPLETED}, ${CampaignStatus.CANCELLED})
          )
        )
      )
    `)
  }

  create(data: Reminder, dbTransaction: DrizzleTransaction | null) {
    const connection = dbTransaction ?? db
    return connection.insert(reminder).values(data).returning({ id: reminder.id })
  }

  // biome-ignore lint/suspicious/noExplicitAny: drizzle-orm internal generics require any here
  private applyEntityJoins<T extends import('drizzle-orm/pg-core').PgSelectBase<any, any, any>>(query: T): T {
    return query
      .leftJoin(
        appointment,
        and(eq(reminder.entityType, ReminderEntityType.APPOINTMENT), eq(appointment.id, reminder.entityId)),
      )
      .leftJoin(
        clinicalProcedure,
        and(eq(reminder.entityType, ReminderEntityType.PROCEDURE), eq(clinicalProcedure.id, reminder.entityId)),
      )
      .leftJoin(
        financialTransaction,
        and(
          eq(reminder.entityType, ReminderEntityType.FINANCIAL_TRANSACTION),
          eq(financialTransaction.id, reminder.entityId),
        ),
      )
      .leftJoin(
        campaign,
        and(eq(reminder.entityType, ReminderEntityType.CAMPAIGN), eq(campaign.id, reminder.entityId)),
      ) as unknown as T
  }

  private buildEntityWindowCondition(now: Date, maxDate: Date) {
    return or(
      and(
        eq(reminder.entityType, ReminderEntityType.APPOINTMENT),
        isNotNull(appointment.id),
        gte(appointment.appointmentDate, now),
        lte(appointment.appointmentDate, maxDate),
      ),
      and(
        eq(reminder.entityType, ReminderEntityType.PROCEDURE),
        isNotNull(clinicalProcedure.id),
        gte(clinicalProcedure.procedureDate, now),
        lte(clinicalProcedure.procedureDate, maxDate),
      ),
      and(
        eq(reminder.entityType, ReminderEntityType.FINANCIAL_TRANSACTION),
        isNotNull(financialTransaction.id),
        eq(financialTransaction.status, TransactionStatus.PENDING),
        sql`${financialTransaction.dueDate} >= CURRENT_DATE`,
        sql`${financialTransaction.dueDate} <= CURRENT_DATE + INTERVAL '3 days'`,
      ),
      and(
        eq(reminder.entityType, ReminderEntityType.CAMPAIGN),
        isNotNull(campaign.id),
        eq(campaign.status, CampaignStatus.ACTIVE),
        sql`${campaign.endDate} >= CURRENT_DATE`,
        sql`${campaign.endDate} <= CURRENT_DATE + INTERVAL '3 days'`,
      ),
    )
  }

  async listByEmployee(data: ListRemindersData): Promise<[number, ReminderWithDetails[]]> {
    const now = new Date()
    const maxDate = new Date(now)
    maxDate.setDate(now.getDate() + 3)

    const eventDate = sql<Date>`COALESCE(${appointment.appointmentDate}, ${clinicalProcedure.procedureDate}, ${financialTransaction.dueDate}::timestamp, ${campaign.endDate}::timestamp)`
    const animalId = sql<number>`COALESCE(${appointment.animalId}, ${clinicalProcedure.animalId}, ${financialTransaction.animalId})`

    const whereList = [eq(reminder.employeeId, data.employeeId), this.buildEntityWindowCondition(now, maxDate)]

    if (data.readStatus === 'unread') {
      whereList.push(isNull(reminder.readAt))
    } else if (data.readStatus === 'read') {
      whereList.push(isNotNull(reminder.readAt))
    }

    const countQuery = await this.applyEntityJoins(db.select({ total: sql<number>`COUNT(*)` }).from(reminder)).where(
      and(...whereList),
    )

    const perPage = data.perPage ?? 20
    const page = data.page ?? 1

    const items = await this.applyEntityJoins(
      db
        .select({
          id: reminder.id,
          entityType: reminder.entityType,
          entityId: reminder.entityId,
          employeeId: reminder.employeeId,
          title: reminder.title,
          message: reminder.message,
          readAt: reminder.readAt,
          createdAt: reminder.createdAt,
          animalName: animal.name,
          eventDate,
        })
        .from(reminder),
    )
      .leftJoin(animal, eq(animal.id, animalId))
      .where(and(...whereList))
      .orderBy(asc(eventDate), desc(reminder.createdAt))
      .limit(perPage)
      .offset((page - 1) * perPage)

    return [countQuery[0]?.total ?? 0, items]
  }

  async countUnreadByEmployee(employeeId: number): Promise<number> {
    const now = new Date()
    const maxDate = new Date(now)
    maxDate.setDate(now.getDate() + 3)

    const [{ total }] = await this.applyEntityJoins(db.select({ total: sql<number>`COUNT(*)` }).from(reminder)).where(
      and(eq(reminder.employeeId, employeeId), isNull(reminder.readAt), this.buildEntityWindowCondition(now, maxDate)),
    )

    return total ?? 0
  }

  async markAsRead(employeeId: number, reminderIds: number[]) {
    if (!reminderIds.length) return

    await db
      .update(reminder)
      .set({ readAt: new Date() })
      .where(and(eq(reminder.employeeId, employeeId), inArray(reminder.id, reminderIds)))
  }

  async updateByEntity(
    entityType: ReminderEntityTypeValue,
    entityId: number,
    employeeId: number,
    data: Partial<Omit<Reminder, 'id'>>,
    dbTransaction: DrizzleTransaction | null,
  ): Promise<number> {
    const connection = dbTransaction ?? db
    const updated = await connection
      .update(reminder)
      .set(data)
      .where(
        and(eq(reminder.entityType, entityType), eq(reminder.entityId, entityId), eq(reminder.employeeId, employeeId)),
      )
      .returning({ id: reminder.id })

    return updated.length
  }

  async upsertByEntity(
    entityType: ReminderEntityTypeValue,
    entityId: number,
    employeeId: number,
    data: { title: string; message: string },
    dbTransaction: DrizzleTransaction | null = null,
  ): Promise<void> {
    const updatedCount = await this.updateByEntity(entityType, entityId, employeeId, data, dbTransaction)
    if (updatedCount === 0) {
      await this.create(
        {
          entityType,
          entityId,
          employeeId,
          title: data.title,
          message: data.message,
          readAt: null,
          createdAt: new Date(),
        } as Reminder,
        dbTransaction,
      )
    }
  }

  async deleteByEntity(
    entityType: ReminderEntityTypeValue,
    entityIds: number[],
    dbTransaction: DrizzleTransaction | null = null,
  ) {
    if (!entityIds.length) return

    const connection = dbTransaction ?? db
    await connection
      .delete(reminder)
      .where(and(eq(reminder.entityType, entityType), inArray(reminder.entityId, entityIds)))
  }
}
