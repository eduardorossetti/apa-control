import { tz } from '@date-fns/tz'
import { endOfDay, parseISO, startOfDay } from 'date-fns'
import { timeZoneName } from './time-zone'

const saoPauloTz = tz(timeZoneName.SP)

function parseDate(value: string) {
  return parseISO(value, { in: saoPauloTz })
}

export function isDateRangeValid(start?: string, end?: string) {
  if (!start || !end) return true

  const startDate = startOfDay(parseDate(start), { in: saoPauloTz })
  const endDate = endOfDay(parseDate(end), { in: saoPauloTz })
  return startDate <= endDate
}

export function isDateTimeRangeValid(start?: string, end?: string) {
  if (!start || !end) return true
  return parseDate(start) <= parseDate(end)
}

export function isDateOnOrAfterNow(date: string) {
  return endOfDay(parseDate(date), { in: saoPauloTz }) >= new Date()
}
