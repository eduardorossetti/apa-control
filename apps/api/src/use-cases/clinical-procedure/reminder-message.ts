import { timeZoneName } from '@/utils/time-zone'
import { tz } from '@date-fns/tz'
import { addDays, format, isSameDay } from 'date-fns'

type ReminderMessageInput = {
  procedureTypeName: string
  animalName: string
  procedureDate: Date
}

export function buildProcedureReminderMessage(data: ReminderMessageInput) {
  const now = new Date()
  const dayText = isSameDay(data.procedureDate, now)
    ? 'hoje'
    : isSameDay(data.procedureDate, addDays(now, 1))
      ? 'amanhã'
      : `dia ${format(data.procedureDate, 'dd/MM/yyyy', { in: tz(timeZoneName.SP) })}`
  const hourText = format(data.procedureDate, "HH'h'mm", { in: tz(timeZoneName.SP) })

  return {
    title: `Procedimento de ${data.procedureTypeName} pra ${data.animalName}`,
    message: `O procedimento de ${data.procedureTypeName} para ${data.animalName} será ${dayText}, às ${hourText}.`,
  }
}
