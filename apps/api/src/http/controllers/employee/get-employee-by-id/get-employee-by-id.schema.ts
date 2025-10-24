import { z } from 'zod'

export const getEmployeeByIdSchema = z.object({
  id: z.coerce.number(),
})
