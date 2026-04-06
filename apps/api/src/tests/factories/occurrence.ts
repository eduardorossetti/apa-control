import { db } from '@/database/client'
import { occurrence } from '@/database/schema/occurrence'
import { faker } from '@/tests/faker'

const OccurrenceFactory = {
  buildCreate: (props?: {
    animalId?: number
    occurrenceTypeId?: number
    occurrenceDate?: string
    description?: string
    observations?: string | null
  }) => ({
    animalId: 1,
    occurrenceTypeId: 1,
    occurrenceDate: faker.date.past({ years: 1 }).toISOString(),
    description: faker.lorem.sentence(),
    observations: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.5 }) ?? null,
    ...props,
  }),

  build: (props?: Partial<typeof occurrence.$inferInsert>) => ({
    animalId: 1,
    occurrenceTypeId: 1,
    employeeId: 1,
    occurrenceDate: faker.date.past({ years: 1 }),
    description: faker.lorem.sentence(),
    observations: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.5 }) ?? null,
    createdAt: new Date(),
    updatedAt: null,
    ...props,
  }),

  create: async (props?: Partial<typeof occurrence.$inferInsert>) => {
    const data = OccurrenceFactory.build(props)
    const [created] = await db.insert(occurrence).values(data).returning()
    return created
  },
}

export { OccurrenceFactory }
