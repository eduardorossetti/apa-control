import { Decimal } from 'decimal.js'

import { db } from '@/database/client'
import { ProcedureCategoryValues } from '@/database/schema/enums/procedure-category'
import { procedureType } from '@/database/schema/procedure-type'
import { faker } from '@/tests/faker'

import type { CreateProcedureTypeData } from '@/use-cases/procedure-type/create-procedure-type/create-procedure-type.dto'

const ProcedureTypeFactory = {
  buildCreate: (props?: Partial<CreateProcedureTypeData>): CreateProcedureTypeData => ({
    name: faker.lorem.words(3),
    description: faker.lorem.paragraph(),
    category: faker.helpers.arrayElement(ProcedureCategoryValues),
    averageCost: faker.number.float({ min: 50, max: 500, fractionDigits: 2 }),
    active: true,
    ...props,
  }),

  build: (props?: Partial<typeof procedureType.$inferInsert>) => ({
    name: faker.lorem.words(3),
    description: faker.lorem.paragraph(),
    category: faker.helpers.arrayElement(ProcedureCategoryValues),
    averageCost: new Decimal(faker.number.float({ min: 50, max: 500, fractionDigits: 2 })),
    active: true,
    createdAt: new Date(),
    ...props,
  }),

  create: async (props?: Partial<typeof procedureType.$inferInsert>) => {
    const data = ProcedureTypeFactory.build(props)

    const [created] = await db.insert(procedureType).values(data).returning()

    return created
  },
}

export { ProcedureTypeFactory }
