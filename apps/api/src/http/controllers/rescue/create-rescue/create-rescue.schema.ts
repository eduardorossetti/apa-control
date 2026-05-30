import { z } from 'zod'

const optionalInteger = z.preprocess(
  (value) => (value === '' || value === null || value === undefined ? null : value),
  z.union([z.coerce.number().int(), z.null(), z.undefined()]),
)

const createAnimalPartSchema = z.object({
  name: z.string().trim().min(1, 'Nome é obrigatório').max(100),
  species: z.string().min(1, 'Espécie é obrigatória'),
  breed: z.string().max(50).nullish(),
  size: z.string().min(1, 'Porte é obrigatório'),
  sex: z.string().min(1, 'Sexo é obrigatório'),
  birthYear: optionalInteger
    .refine((value) => value === undefined || value === null || value >= 1900, 'Ano de nascimento inválido')
    .optional(),
  healthCondition: z.string().min(1, 'Condição de saúde é obrigatória'),
  entryDate: z.string().min(1, 'Data de entrada é obrigatória'),
  observations: z.string().nullish(),
})

export const createRescueSchema = z
  .object({
    animalId: z.coerce.number().int().positive().optional(),
    animal: createAnimalPartSchema.optional(),
    rescueDate: z.string().min(1, 'Data do resgate é obrigatória'),
    locationFound: z.string().trim().min(1, 'Local encontrado é obrigatório').max(200),
    circumstances: z.string().trim().min(1, 'Circunstâncias são obrigatórias'),
    foundConditions: z.string().trim().min(1, 'Condições em que foi encontrado é obrigatório'),
    immediateProcedures: z.string().nullish(),
    observations: z.string().nullish(),
  })
  .refine((data) => (data.animalId != null) !== (data.animal != null), {
    message: 'Informe apenas um: animalId (animal existente) ou dados do animal (novo). Não envie os dois.',
    path: ['animalId'],
  })

export type CreateRescueBody = z.infer<typeof createRescueSchema>
