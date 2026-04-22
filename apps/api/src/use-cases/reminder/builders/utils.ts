import { timeZoneName } from '@/utils/time-zone'
import { tz } from '@date-fns/tz'
import { addDays, differenceInCalendarDays, format, isSameDay } from 'date-fns'

export function formatRelativeDayText(date: Date, opts?: { includeOverdue?: boolean; overduePrefix?: string }): string {
  const now = new Date()
  const tzParams = { in: tz(timeZoneName.SP) }
  const formattedDate = format(date, 'dd/MM/yyyy', tzParams)

  if (isSameDay(date, now)) return 'hoje'
  if (isSameDay(date, addDays(now, 1))) return 'amanhã'

  if (opts?.includeOverdue && differenceInCalendarDays(date, now) < 0) {
    const prefix = opts.overduePrefix ?? 'venceu em'
    return `em atraso (${prefix} ${formattedDate})`
  }

  return `dia ${formattedDate}`
}
