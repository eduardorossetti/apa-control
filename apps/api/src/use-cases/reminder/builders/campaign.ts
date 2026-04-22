import { timeZoneName } from '@/utils/time-zone'
import { tz } from '@date-fns/tz'
import { parseISO } from 'date-fns'
import { formatRelativeDayText } from './utils'

export type CampaignReminderInput = {
  title: string
  endDate: string
}

export function buildCampaignReminderMessage(data: CampaignReminderInput) {
  const endDate = parseISO(data.endDate, { in: tz(timeZoneName.SP) })
  const dayText = formatRelativeDayText(endDate, { includeOverdue: true, overduePrefix: 'encerrou em' })

  return {
    title: `Campanha encerrando: ${data.title}`,
    message: `A campanha "${data.title}" encerra ${dayText}.`,
  }
}
