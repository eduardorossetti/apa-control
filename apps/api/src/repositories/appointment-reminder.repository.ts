import { db } from '@/database/client'
import { animal, appointment, appointmentReminder, clinicalProcedure } from '@/database/schema'
import { AppointmentStatus } from '@/database/schema/enums/appointment-status'
import { ProcedureStatus } from '@/database/schema/enums/procedure-status'
import type { DrizzleTransaction } from '@/database/types'
import type { AppointmentReminder } from '@/entities'
import type {
  AppointmentReminderWithDetails,
  ListAppointmentRemindersData,
} from '@/use-cases/appointment-reminder/list-appointment-reminders/list-appointment-reminders.dto'
import { and, asc, desc, eq, gte, inArray, isNotNull, isNull, lte, or, sql } from 'drizzle-orm'

export class AppointmentReminderRepository {
  async purgeInvalidReminders() {
    await db.execute(sql`
      DELETE FROM appointment_reminder ar
      WHERE (ar.appointment_id IS NULL AND ar.procedure_id IS NULL)
         OR EXISTS (
           SELECT 1
           FROM appointment a
           WHERE a.id = ar.appointment_id
             AND a.status IN (${AppointmentStatus.COMPLETED}, ${AppointmentStatus.CANCELLED})
         )
         OR EXISTS (
           SELECT 1
           FROM clinical_procedure cp
           WHERE cp.id = ar.procedure_id
             AND cp.status IN (${ProcedureStatus.COMPLETED}, ${ProcedureStatus.CANCELLED})
         )
    `)
  }

  create(data: AppointmentReminder, dbTransaction: DrizzleTransaction | null) {
    const connection = dbTransaction ?? db
    return connection.insert(appointmentReminder).values(data).returning({ id: appointmentReminder.id })
  }

  async listByEmployee(data: ListAppointmentRemindersData): Promise<[number, AppointmentReminderWithDetails[]]> {
    const now = new Date()
    const maxDate = new Date(now)
    maxDate.setDate(now.getDate() + 3)

    const referenceDate = sql<Date>`COALESCE(${appointment.appointmentDate}, ${clinicalProcedure.procedureDate})`
    const animalId = sql<number>`COALESCE(${appointment.animalId}, ${clinicalProcedure.animalId})`

    const whereList = [
      eq(appointmentReminder.employeeId, data.employeeId),
      or(
        and(
          isNotNull(appointmentReminder.appointmentId),
          gte(appointment.appointmentDate, now),
          lte(appointment.appointmentDate, maxDate),
        ),
        and(
          isNotNull(appointmentReminder.procedureId),
          gte(clinicalProcedure.procedureDate, now),
          lte(clinicalProcedure.procedureDate, maxDate),
        ),
      ),
    ]

    if (data.readStatus === 'unread') {
      whereList.push(isNull(appointmentReminder.readAt))
    } else if (data.readStatus === 'read') {
      whereList.push(isNotNull(appointmentReminder.readAt))
    }

    const countQuery = await db
      .select({ total: sql<number>`COUNT(*)` })
      .from(appointmentReminder)
      .leftJoin(appointment, eq(appointment.id, appointmentReminder.appointmentId))
      .leftJoin(clinicalProcedure, eq(clinicalProcedure.id, appointmentReminder.procedureId))
      .where(and(...whereList))

    const perPage = data.perPage ?? 20
    const page = data.page ?? 1

    const items = await db
      .select({
        id: appointmentReminder.id,
        appointmentId: appointmentReminder.appointmentId,
        procedureId: appointmentReminder.procedureId,
        employeeId: appointmentReminder.employeeId,
        title: appointmentReminder.title,
        message: appointmentReminder.message,
        readAt: appointmentReminder.readAt,
        createdAt: appointmentReminder.createdAt,
        animalName: animal.name,
        appointmentDate: referenceDate,
      })
      .from(appointmentReminder)
      .leftJoin(appointment, eq(appointment.id, appointmentReminder.appointmentId))
      .leftJoin(clinicalProcedure, eq(clinicalProcedure.id, appointmentReminder.procedureId))
      .leftJoin(animal, eq(animal.id, animalId))
      .where(and(...whereList))
      .orderBy(asc(referenceDate), desc(appointmentReminder.createdAt))
      .limit(perPage)
      .offset((page - 1) * perPage)

    return [countQuery[0]?.total ?? 0, items]
  }

  async countUnreadByEmployee(employeeId: number): Promise<number> {
    const now = new Date()
    const maxDate = new Date(now)
    maxDate.setDate(now.getDate() + 3)

    const [{ total }] = await db
      .select({ total: sql<number>`COUNT(*)` })
      .from(appointmentReminder)
      .leftJoin(appointment, eq(appointment.id, appointmentReminder.appointmentId))
      .leftJoin(clinicalProcedure, eq(clinicalProcedure.id, appointmentReminder.procedureId))
      .where(
        and(
          eq(appointmentReminder.employeeId, employeeId),
          isNull(appointmentReminder.readAt),
          or(
            and(
              isNotNull(appointmentReminder.appointmentId),
              gte(appointment.appointmentDate, now),
              lte(appointment.appointmentDate, maxDate),
            ),
            and(
              isNotNull(appointmentReminder.procedureId),
              gte(clinicalProcedure.procedureDate, now),
              lte(clinicalProcedure.procedureDate, maxDate),
            ),
          ),
        ),
      )

    return total ?? 0
  }

  async markAsRead(employeeId: number, reminderIds: number[]) {
    if (!reminderIds.length) return

    await db
      .update(appointmentReminder)
      .set({ readAt: new Date() })
      .where(and(eq(appointmentReminder.employeeId, employeeId), inArray(appointmentReminder.id, reminderIds)))
  }

  async updateByAppointmentId(
    appointmentId: number,
    employeeId: number,
    data: Partial<Omit<AppointmentReminder, 'id'>>,
    dbTransaction: DrizzleTransaction | null,
  ): Promise<number> {
    const connection = dbTransaction ?? db
    const updated = await connection
      .update(appointmentReminder)
      .set(data)
      .where(and(eq(appointmentReminder.appointmentId, appointmentId), eq(appointmentReminder.employeeId, employeeId)))
      .returning({ id: appointmentReminder.id })

    return updated.length
  }

  async updateByProcedureId(
    procedureId: number,
    employeeId: number,
    data: Partial<Omit<AppointmentReminder, 'id'>>,
    dbTransaction: DrizzleTransaction | null,
  ): Promise<number> {
    const connection = dbTransaction ?? db
    const updated = await connection
      .update(appointmentReminder)
      .set(data)
      .where(and(eq(appointmentReminder.procedureId, procedureId), eq(appointmentReminder.employeeId, employeeId)))
      .returning({ id: appointmentReminder.id })

    return updated.length
  }

  async deleteByAppointmentIds(appointmentIds: number[], dbTransaction: DrizzleTransaction | null = null) {
    if (!appointmentIds.length) return

    const connection = dbTransaction ?? db
    await connection.delete(appointmentReminder).where(inArray(appointmentReminder.appointmentId, appointmentIds))
  }

  async deleteByProcedureIds(procedureIds: number[], dbTransaction: DrizzleTransaction | null = null) {
    if (!procedureIds.length) return

    const connection = dbTransaction ?? db
    await connection.delete(appointmentReminder).where(inArray(appointmentReminder.procedureId, procedureIds))
  }
}
