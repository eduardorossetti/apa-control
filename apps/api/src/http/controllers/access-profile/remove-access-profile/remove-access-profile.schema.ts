import { z } from 'zod'

export const removeAccessProfileSchema = z.object({ id: z.coerce.number() })
