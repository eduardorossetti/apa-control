import { db } from '@/database/client'
import { AnimalHistoryType } from '@/database/schema/enums/animal-history-type'
import { ProcedureStatus } from '@/database/schema/enums/procedure-status'
import { ReminderEntityType } from '@/database/schema/enums/reminder-entity-type'
import { AnimalHistory, Reminder } from '@/entities'
import type { AnimalHistoryRepository } from '@/repositories/animal-history.repository'
import type { AnimalRepository } from '@/repositories/animal.repository'
import type { AppointmentRepository } from '@/repositories/appointment.repository'
import type { ClinicalProcedureRepository } from '@/repositories/clinical-procedure.repository'
import type { ProcedureTypeRepository } from '@/repositories/procedure-type.repository'
import type { ReminderRepository } from '@/repositories/reminder.repository'
import { ApiError } from '@/utils/api-error'
import { timeZoneName } from '@/utils/time-zone'
import { tz } from '@date-fns/tz'
import { parseISO } from 'date-fns'
import Decimal from 'decimal.js'
import { buildProcedureReminderMessage } from '../../reminder/builders'
import type { UpdateClinicalProcedureData } from './update-clinical-procedure.dto'

export class UpdateClinicalProcedureUseCase {
  constructor(
    private clinicalProcedureRepository: ClinicalProcedureRepository,
    private reminderRepository: ReminderRepository,
    private procedureTypeRepository: ProcedureTypeRepository,
    private animalRepository: AnimalRepository,
    private appointmentRepository: AppointmentRepository,
    private animalHistoryRepository: AnimalHistoryRepository,
  ) {}

  async execute(data: UpdateClinicalProcedureData, employeeId: number): Promise<void> {
    const existing = await this.clinicalProcedureRepository.findById(data.id)
    if (!existing) throw new ApiError('Procedimento clínico não encontrado.', 404)
    if (existing.status !== ProcedureStatus.SCHEDULED) {
      throw new ApiError('Apenas procedimentos clínicos agendados podem ser editados.', 409)
    }

    const [animal, procedureType] = await Promise.all([
      this.animalRepository.findById(data.animalId),
      this.procedureTypeRepository.findById(data.procedureTypeId),
    ])
    if (!animal) throw new ApiError('Animal não encontrado.', 404)
    if (!procedureType) throw new ApiError('Tipo de procedimento não encontrado.', 404)
    if (!procedureType.active) throw new ApiError('Tipo de procedimento inativo.', 409)

    if (data.appointmentId) {
      const appointment = await this.appointmentRepository.findById(data.appointmentId)
      if (!appointment) throw new ApiError('Consulta não encontrada.', 404)
      if (appointment.animalId !== data.animalId) {
        throw new ApiError('A consulta informada não pertence ao animal selecionado.', 409)
      }
    }

    const procedureDate = parseISO(data.procedureDate, { in: tz(timeZoneName.SP) })
    if (Number.isNaN(procedureDate.getTime())) throw new ApiError('Data/hora do procedimento inválida.', 400)

    const reminder = buildProcedureReminderMessage({
      procedureTypeName: procedureType.name,
      animalName: animal.name,
      procedureDate,
    })

    const normalizedData = {
      animalId: data.animalId,
      procedureTypeId: data.procedureTypeId,
      appointmentId: data.appointmentId ?? null,
      procedureDate,
      description: data.description,
      proof: data.proof ?? null,
      actualCost: data.actualCost ?? null,
      observations: data.observations ?? null,
      status: existing.status,
    } as const

    const comparableExisting = {
      animalId: existing.animalId,
      procedureTypeId: existing.procedureTypeId,
      appointmentId: existing.appointmentId ?? null,
      procedureDate: existing.procedureDate.getTime(),
      description: existing.description,
      proof: existing.proof ?? null,
      actualCost: existing.actualCost === null ? null : String(existing.actualCost),
      observations: existing.observations ?? null,
      status: existing.status,
    } as const

    const comparableNew = {
      animalId: normalizedData.animalId,
      procedureTypeId: normalizedData.procedureTypeId,
      appointmentId: normalizedData.appointmentId,
      procedureDate: normalizedData.procedureDate.getTime(),
      description: normalizedData.description,
      proof: normalizedData.proof,
      actualCost: normalizedData.actualCost === null ? null : String(normalizedData.actualCost),
      observations: normalizedData.observations,
      status: normalizedData.status,
    } as const

    const changedData = (Object.keys(normalizedData) as (keyof typeof normalizedData)[]).reduce(
      (acc, key) => {
        if (JSON.stringify(comparableExisting[key]) !== JSON.stringify(comparableNew[key])) {
          return { ...acc, [key]: normalizedData[key] }
        }

        return acc
      },
      {} as Record<string, unknown>,
    )

    let oldProcedureTypeName: string | null = null
    let oldAnimalName: string | null = null
    await Promise.all([
      'procedureTypeId' in changedData
        ? this.procedureTypeRepository.findById(existing.procedureTypeId).then((t) => {
            oldProcedureTypeName = t?.name ?? null
          })
        : Promise.resolve(),
      'animalId' in changedData
        ? this.animalRepository.findById(existing.animalId).then((a) => {
            oldAnimalName = a?.name ?? null
          })
        : Promise.resolve(),
    ])

    const oldValues = Object.keys(changedData).reduce<Record<string, unknown>>((acc, key) => {
      if (key === 'procedureTypeId') acc[key] = oldProcedureTypeName
      else if (key === 'animalId') acc[key] = oldAnimalName
      else acc[key] = (existing as Record<string, unknown>)[key] ?? null
      return acc
    }, {})

    const newValues = Object.keys(changedData).reduce<Record<string, unknown>>((acc, key) => {
      if (key === 'procedureTypeId') acc[key] = procedureType.name
      else if (key === 'animalId') acc[key] = animal.name
      else acc[key] = changedData[key]
      return acc
    }, {})

    if (Object.keys(changedData).length === 0) return

    await db.transaction(async (tx) => {
      await this.clinicalProcedureRepository.update(
        data.id,
        {
          animalId: normalizedData.animalId,
          procedureTypeId: normalizedData.procedureTypeId,
          appointmentId: normalizedData.appointmentId,
          procedureDate,
          description: normalizedData.description,
          proof: normalizedData.proof,
          actualCost: normalizedData.actualCost === null ? null : new Decimal(normalizedData.actualCost),
          observations: normalizedData.observations,
          status: normalizedData.status,
        },
        tx,
      )

      await this.reminderRepository.upsertByEntity(
        ReminderEntityType.PROCEDURE,
        data.id,
        existing.employeeId,
        { title: reminder.title, message: reminder.message },
        tx,
      )

      await this.animalHistoryRepository.create(
        new AnimalHistory({
          animalId: data.animalId,
          rescueId: null,
          employeeId,
          type: AnimalHistoryType.PROCEDURE,
          action: 'clinical-procedure.updated',
          description: `Procedimento ${procedureType.name} atualizado`,
          oldValue: JSON.stringify(oldValues),
          newValue: JSON.stringify(newValues),
          createdAt: new Date(),
        }),
        tx,
      )
    })
  }
}
