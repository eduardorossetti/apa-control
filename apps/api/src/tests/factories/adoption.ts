import { AdoptionStatus } from '@/database/schema/enums/adoption-status'
import { AnimalStatus } from '@/database/schema/enums/animal-status'
import { faker } from '@/tests/faker'

import type { CreateAdoptionData } from '@/use-cases/adoption/create-adoption/create-adoption.dto'

const AdoptionFactory = {
  buildCreate: (props?: Partial<CreateAdoptionData>): CreateAdoptionData => ({
    animalId: 1,
    adopterId: 1,
    adoptionDate: faker.date.past({ years: 1 }).toISOString().split('T')[0],
    adaptationPeriod: faker.helpers.maybe(() => faker.number.int({ min: 7, max: 90 }), { probability: 0.5 }) ?? null,
    status: AdoptionStatus.PROCESSING,
    observations: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.5 }) ?? null,
    proof: null,
    ...props,
  }),
}

export { AdoptionFactory }
