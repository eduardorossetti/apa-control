import { timeZoneName } from '@/utils/time-zone'
import { tz } from '@date-fns/tz'
import { format } from 'date-fns'
import { formatRelativeDayText } from './utils'

export type ProcedureReminderInput = {
  procedureTypeName: string
  animalName: string
  procedureDate: Date
}

export function buildProcedureReminderMessage(data: ProcedureReminderInput) {
  const dayText = formatRelativeDayText(data.procedureDate)
  const hourText = format(data.procedureDate, "HH'h'mm", { in: tz(timeZoneName.SP) })

  return {
    title: `Procedimento de ${data.procedureTypeName} pra ${data.animalName}`,
    message: `O procedimento de ${data.procedureTypeName} para ${data.animalName} será ${dayText}, às ${hourText}.`,
  }
}
