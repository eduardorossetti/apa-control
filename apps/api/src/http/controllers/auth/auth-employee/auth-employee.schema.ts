import { z } from 'zod'

export const authEmployeeSchema = z.object({
  login: z.string({ message: 'O login é obrigatório.' }).trim(),
  password: z.string({ message: 'A senha é obrigatória.' }).trim(),
})
