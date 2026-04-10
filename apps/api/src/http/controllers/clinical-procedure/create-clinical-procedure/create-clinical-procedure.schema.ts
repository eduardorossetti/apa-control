import { z } from 'zod'

const optionalId = z.preprocess(
  (v) => (v === '' || v === null || v === undefined ? null : v),
  z.union([z.coerce.number().int().positive(), z.null()]),
)
const optionalCost = z.preprocess(
  (v) => (v === '' || v === null || v === undefined ? null : v),
  z.union([z.coerce.number().nonnegative('Custo deve ser maior ou igual a zero'), z.null()]),
)

export const createClinicalProcedureSchema = z.object({
  animalId: z.coerce.number().int().positive('Animal é obrigatório'),
  procedureTypeId: z.coerce.number().int().positive('Tipo de procedimento é obrigatório'),
  appointmentId: optionalId,
  procedureDate: z.string().min(1, 'Data/hora do procedimento é obrigatória'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  proof: z.string().nullish(),
  actualCost: optionalCost,
  observations: z.string().nullish(),
})
