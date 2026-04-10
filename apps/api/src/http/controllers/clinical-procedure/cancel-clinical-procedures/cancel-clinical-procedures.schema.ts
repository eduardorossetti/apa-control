import { z } from 'zod'

export const cancelClinicalProceduresSchema = z.object({
  ids: z.array(z.coerce.number()).min(1),
})
