import { z } from 'zod'

export const getAccessProfileByIdSchema = z.object({
  id: z.coerce.number(),
})
