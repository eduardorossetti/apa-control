import { z } from 'zod'

export const disableEmployeeSchema = z.object({
  id: z.number({ error: 'O código do funcionário é obrigatório.' }),
  disabled: z.boolean({ error: 'O status de desabilitação é obrigatório.' }),
})
