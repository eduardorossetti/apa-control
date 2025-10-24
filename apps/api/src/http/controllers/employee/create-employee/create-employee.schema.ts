import { isCpf } from '@/utils/cpf-cnpj'
import { z } from 'zod'

export const createEmployeeSchema = z.object({
  name: z
    .string({ error: 'O nome do funcionário é obrigatório.' })
    .trim()
    .min(8, 'O nome do funcionário deve ter pelo menos 8 caracteres.'),
  cpf: z
    .string({ error: 'O CPF do funcionário é obrigatório.' })
    .transform((cpf) => cpf.replace(/\D/g, ''))
    .refine((cpf) => isCpf(cpf), 'Informe um número de CPF válido.'),
  email: z.string().trim().email('Informe um endereço de e-mail válido.').nullish().or(z.literal('')),
  phone: z
    .string()
    .transform((phone) => phone.replace(/\D/g, ''))
    .refine((phone) => [0, 10, 11].includes(phone.length), 'Informe um número de telefone válido.')
    .nullish(),
  login: z
    .string({ error: 'O login do funcionário é obrigatório.' })
    .trim()
    .min(6, 'O login do funcionário deve ter pelo menos 6 caracteres.')
    .transform((login) =>
      login
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase(),
    ),
  password: z.string({ error: 'A senha do funcionário é obrigatória.' }).trim(),
  profileId: z.number(),
  streetName: z.string().trim().nullish(),
  streetNumber: z.string().trim().max(10, 'O número do endereço deve ter no máximo 10 caracteres.').nullish(),
  district: z.string().trim().nullish(),
  city: z.string().trim().nullish(),
  state: z.string().trim().nullish(),
  postalCode: z
    .string()
    .transform((postalCode) => postalCode.replace(/\D/g, ''))
    .nullish(),
  complement: z.string().trim().nullish(),
})
