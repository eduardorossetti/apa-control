import { db } from '@/database/client'
import { finalDestination } from '@/database/schema/final-destination'
import { faker } from '@/tests/faker'

const FinalDestinationFactory = {
  buildCreate: (props?: {
    animalId?: number
    destinationTypeId?: number
    destinationDate?: string
    reason?: string
    observations?: string | null
    proof?: string | null
  }) => ({
    animalId: 1,
    destinationTypeId: 1,
    destinationDate: faker.date.past({ years: 1 }).toISOString().split('T')[0],
    reason: faker.lorem.sentence(),
    observations: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.5 }) ?? null,
    proof: null,
    ...props,
  }),

  build: (props?: Partial<typeof finalDestination.$inferInsert>) => ({
    animalId: 1,
    destinationTypeId: 1,
    employeeId: 1,
    destinationDate: faker.date.past({ years: 1 }).toISOString().split('T')[0],
    reason: faker.lorem.sentence(),
    observations: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.5 }) ?? null,
    proof: null,
    createdAt: new Date(),
    ...props,
  }),

  create: async (props?: Partial<typeof finalDestination.$inferInsert>) => {
    const data = FinalDestinationFactory.build(props)
    const [created] = await db.insert(finalDestination).values(data).returning()
    return created
  },
}

export { FinalDestinationFactory }
