import { timeZoneName } from '@/utils/time-zone'
import { tz } from '@date-fns/tz'
import { parseISO } from 'date-fns'
import { formatRelativeDayText } from './utils'

export type FinancialTransactionReminderInput = {
  description: string
  dueDate: string
}

export function buildFinancialTransactionReminderMessage(data: FinancialTransactionReminderInput) {
  const dueDate = parseISO(data.dueDate, { in: tz(timeZoneName.SP) })
  const dayText = formatRelativeDayText(dueDate, { includeOverdue: true, overduePrefix: 'venceu em' })

  return {
    title: `Despesa pendente: ${data.description}`,
    message: `A despesa "${data.description}" vence ${dayText}.`,
  }
}
