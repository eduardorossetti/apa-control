import { z } from 'zod'

export const readRemindersSchema = z.object({
  reminderIds: z.array(z.number().int().positive()).default([]),
})
