import { db } from '@/database/client'
import { TransactionCategoryValues } from '@/database/schema/enums/transaction-category'
import { transactionType } from '@/database/schema/transaction-type'
import { faker } from '@/tests/faker'

import type { CreateTransactionTypeData } from '@/use-cases/transaction-type/create-transaction-type/create-transaction-type.dto'

const TransactionTypeFactory = {
  buildCreate: (props?: Partial<CreateTransactionTypeData>): CreateTransactionTypeData => ({
    name: faker.lorem.words(3),
    category: faker.helpers.arrayElement(TransactionCategoryValues),
    description: faker.lorem.paragraph(),
    active: true,
    ...props,
  }),

  build: (props?: Partial<typeof transactionType.$inferInsert>) => ({
    name: faker.lorem.words(3),
    category: faker.helpers.arrayElement(TransactionCategoryValues),
    description: faker.lorem.paragraph(),
    active: true,
    createdAt: new Date(),
    ...props,
  }),

  create: async (props?: Partial<typeof transactionType.$inferInsert>) => {
    const data = TransactionTypeFactory.build(props)

    const [created] = await db.insert(transactionType).values(data).returning()

    return created
  },
}

export { TransactionTypeFactory }
