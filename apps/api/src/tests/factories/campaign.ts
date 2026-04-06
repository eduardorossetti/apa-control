import { faker } from '@/tests/faker'
import type { CreateCampaignData } from '@/use-cases/campaign/create-campaign/create-campaign.dto'

const CampaignFactory = {
  buildCreate: (props?: Partial<CreateCampaignData>): CreateCampaignData => {
    const startDate = faker.date.past({ years: 1 }).toISOString().split('T')[0]
    const endDate = faker.date.future({ years: 1 }).toISOString().split('T')[0]
    return {
      campaignTypeId: 1,
      title: faker.lorem.sentence({ min: 2, max: 5 }),
      description: faker.lorem.paragraph(),
      startDate,
      endDate,
      fundraisingGoal:
        faker.helpers.maybe(() => faker.number.float({ min: 100, max: 10000, fractionDigits: 2 }), {
          probability: 0.7,
        }) ?? null,
      observations: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.4 }) ?? null,
      ...props,
    }
  },
}

export { CampaignFactory }
