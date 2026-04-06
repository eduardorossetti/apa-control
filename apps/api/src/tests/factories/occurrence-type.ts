import { db } from '@/database/client'
import { occurrenceType } from '@/database/schema/occurrence-type'
import { faker } from '@/tests/faker'

const OccurrenceTypeFactory = {
  build: (props?: Partial<typeof occurrenceType.$inferInsert>) => ({
    name: faker.lorem.words(3),
    description: faker.lorem.paragraph(),
    active: true,
    createdAt: new Date(),
    ...props,
  }),

  create: async (props?: Partial<typeof occurrenceType.$inferInsert>) => {
    const data = OccurrenceTypeFactory.build(props)
    const [created] = await db.insert(occurrenceType).values(data).returning()
    return created
  },
}

export { OccurrenceTypeFactory }
