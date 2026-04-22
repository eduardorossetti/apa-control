export const ReminderEntityType = {
  APPOINTMENT: 'appointment',
  PROCEDURE: 'procedure',
  FINANCIAL_TRANSACTION: 'financial_transaction',
  CAMPAIGN: 'campaign',
} as const

export type ReminderEntityTypeValue = (typeof ReminderEntityType)[keyof typeof ReminderEntityType]

export const ReminderEntityTypeValues = Object.values(ReminderEntityType) as [
  ReminderEntityTypeValue,
  ...ReminderEntityTypeValue[],
]
