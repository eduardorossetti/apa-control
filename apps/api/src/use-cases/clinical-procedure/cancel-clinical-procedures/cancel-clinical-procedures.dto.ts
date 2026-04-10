import type { cancelClinicalProceduresSchema } from '@/http/controllers/clinical-procedure/cancel-clinical-procedures/cancel-clinical-procedures.schema'
import type { z } from 'zod'

export type CancelClinicalProceduresData = z.infer<typeof cancelClinicalProceduresSchema>
