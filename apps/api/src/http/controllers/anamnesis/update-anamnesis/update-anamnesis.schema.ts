import { z } from 'zod'

export const updateAnamnesisSchema = z
  .object({
    id: z.coerce.number().int().positive('ID deve ser um número positivo'),
    appointmentId: z.coerce.number().int().positive('Consulta é obrigatória'),
    symptomsPresented: z.string().nullish(),
    dietaryHistory: z.string().nullish(),
    behavioralHistory: z.string().nullish(),
    requestedExams: z.string().nullish(),
    presumptiveDiagnosis: z.string().nullish(),
    observations: z.string().nullish(),
    proof: z.string().nullish(),
  })
  .superRefine((data, ctx) => {
    const hasText = (value: unknown) => typeof value === 'string' && value.trim().length > 0
    const hasProof = hasText(data.proof)
    const requiredFields = [
      'symptomsPresented',
      'dietaryHistory',
      'behavioralHistory',
      'requestedExams',
      'presumptiveDiagnosis',
    ] as const
    const missingRequiredFields = requiredFields.filter((field) => !hasText(data[field]))

    if (hasProof || missingRequiredFields.length === 0) return

    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Anexe um arquivo ou preencha os campos obrigatórios da anamnese.',
      path: ['proof'],
    })

    for (const field of missingRequiredFields) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Campo obrigatório quando não houver arquivo.',
        path: [field],
      })
    }
  })
