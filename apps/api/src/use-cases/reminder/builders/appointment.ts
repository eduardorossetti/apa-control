import { ConsultationType } from '@/database/schema/enums/consultation-type'
import { timeZoneName } from '@/utils/time-zone'
import { tz } from '@date-fns/tz'
import { format } from 'date-fns'

export type AppointmentReminderInput = {
  appointmentTypeName: string
  animalName: string
  appointmentDate: Date
  consultationType: string
  clinicName?: string | null
}

export function buildAppointmentReminderMessage(data: AppointmentReminderInput) {
  const dayText = `dia ${format(data.appointmentDate, 'dd/MM/yyyy', { in: tz(timeZoneName.SP) })}`
  const hourText = format(data.appointmentDate, "HH'h'mm", { in: tz(timeZoneName.SP) })
  const locationText =
    data.consultationType === ConsultationType.CLINICAL && data.clinicName
      ? `, em ${data.clinicName}`
      : data.consultationType === ConsultationType.HOME
        ? ', em atendimento domiciliar'
        : ''

  return {
    title: `Consulta de ${data.appointmentTypeName} pra ${data.animalName}`,
    message: `A consulta de ${data.appointmentTypeName} para ${data.animalName} será ${dayText}, às ${hourText}${locationText}.`,
  }
}
