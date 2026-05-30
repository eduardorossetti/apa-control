import { isDateRangeValid } from '@/utils/date-range'
import { z } from 'zod'

const optionalFundraisingGoal = z.preprocess(
  (value) => (value === '' || value === null || value === undefined ? null : value),
  z.union([z.coerce.number().nonnegative('Meta de arrecadação deve ser maior ou igual a zero'), z.null()]),
)

export const createCampaignSchema = z
  .object({
    campaignTypeId: z.coerce.number().int().positive('Tipo de campanha é obrigatório'),
    title: z.string().trim().min(1, 'Título é obrigatório').max(200),
    description: z.string().trim().min(1, 'Descrição é obrigatória'),
    startDate: z.string().trim().min(1, 'Data inicial é obrigatória'),
    endDate: z.string().trim().min(1, 'Data final é obrigatória'),
    fundraisingGoal: optionalFundraisingGoal,
    proof: z.string().nullish(),
    observations: z.string().nullish(),
  })
  .refine((data) => isDateRangeValid(data.startDate, data.endDate), {
    message: 'A data inicial deve ser menor ou igual à data final.',
    path: ['endDate'],
  })
