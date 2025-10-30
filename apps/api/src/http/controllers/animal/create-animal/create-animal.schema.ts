import { z } from 'zod'

export const createAnimalSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome deve ter no máximo 100 caracteres'),
  species: z.string().min(1, 'Espécie é obrigatória'),
  breed: z.string().max(50, 'Raça deve ter no máximo 50 caracteres').optional().nullable(),
  size: z.string().min(1, 'Porte é obrigatório'),
  sex: z.string().min(1, 'Sexo é obrigatório'),
  age: z.number().int().min(0, 'Idade deve ser maior ou igual a 0'),
  healthCondition: z.string().min(1, 'Condição de saúde é obrigatória'),
  entryDate: z.string().min(1, 'Data de entrada é obrigatória'),
  observations: z.string().optional().nullable(),
  status: z.string().min(1, 'Status é obrigatório'),
})
