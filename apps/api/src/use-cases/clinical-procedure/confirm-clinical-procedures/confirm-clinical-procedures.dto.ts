import type { confirmClinicalProceduresSchema } from '@/http/controllers/clinical-procedure/confirm-clinical-procedures/confirm-clinical-procedures.schema'
import type { z } from 'zod'

export type ConfirmClinicalProceduresData = z.infer<typeof confirmClinicalProceduresSchema>
