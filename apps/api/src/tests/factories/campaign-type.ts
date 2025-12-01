import { db } from '@/database/client'
import { campaignType } from '@/database/schema/campaign-type'
import { faker } from '@/tests/faker'

import type { CreateCampaignTypeData } from '@/use-cases/campaign-type/create-campaign-type/create-campaign-type.dto'

const CampaignTypeFactory = {
  buildCreate: (props?: Partial<CreateCampaignTypeData>): CreateCampaignTypeData => ({
    name: faker.lorem.words(3),
    description: faker.lorem.paragraph(),
    active: true,
    ...props,
  }),

  build: (props?: Partial<typeof campaignType.$inferInsert>) => ({
    name: faker.lorem.words(3),
    description: faker.lorem.paragraph(),
    active: true,
    createdAt: new Date(),
    ...props,
  }),

  create: async (props?: Partial<typeof campaignType.$inferInsert>) => {
    const data = CampaignTypeFactory.build(props)

    const [created] = await db.insert(campaignType).values(data).returning()

    return created
  },
}

export { CampaignTypeFactory }
