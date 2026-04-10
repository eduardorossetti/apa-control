import { z } from 'zod'

export const confirmClinicalProceduresSchema = z.object({
  ids: z.array(z.coerce.number()).min(1),
})
