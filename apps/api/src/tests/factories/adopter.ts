import { Decimal } from 'decimal.js'

import { db } from '@/database/client'
import { adopter } from '@/database/schema/adopter'
import { faker } from '@/tests/faker'
import { getValidationDigit } from '@/utils/cpf-cnpj'

function generateCpf() {
  const base = faker.string.numeric({ length: 9, allowLeadingZeros: true })
  const digits = base.split('').map(Number)

  const firstDigit = getValidationDigit(digits, 10, 'cpf')
  const secondDigit = getValidationDigit([...digits, firstDigit], 11, 'cpf')

  return `${base}${firstDigit}${secondDigit}`
}

import type { CreateAdopterData } from '@/use-cases/adopter/create-adopter/create-adopter.dto'

const AdopterFactory = {
  buildCreate: (props?: Partial<CreateAdopterData>): CreateAdopterData => ({
    name: faker.person.fullName(),
    cpf: generateCpf(),
    email: faker.internet.email(),
    phone: faker.phone.number().replace(/\D/g, '').slice(0, 20),
    address: faker.location.streetAddress(),
    familyIncome: faker.number.float({ min: 1000, max: 10000, fractionDigits: 2 }),
    animalExperience: faker.datatype.boolean(),
    ...props,
  }),

  build: (props?: Partial<typeof adopter.$inferInsert>) => ({
    name: faker.person.fullName(),
    cpf: generateCpf(),
    email: faker.internet.email(),
    phone: faker.phone.number().replace(/\D/g, '').slice(0, 20),
    address: faker.location.streetAddress(),
    familyIncome: new Decimal(faker.number.float({ min: 1000, max: 10000, fractionDigits: 2 })),
    animalExperience: faker.datatype.boolean(),
    createdAt: new Date(),
    ...props,
  }),

  create: async (props?: Partial<typeof adopter.$inferInsert>) => {
    const adopterData = AdopterFactory.build(props)

    const [created] = await db.insert(adopter).values(adopterData).returning()

    return created
  },
}

export { AdopterFactory }
