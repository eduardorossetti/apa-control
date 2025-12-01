import { db } from '@/database/client'
import { accessProfile } from '@/database/schema/access-profile'
import { faker } from '@/tests/faker'

import type { CreateAccessProfileData } from '@/use-cases/access-profile/create-access-profile/create-access-profile.dto'

const AccessProfileFactory = {
  buildCreate: (props?: Partial<CreateAccessProfileData>): CreateAccessProfileData => ({
    description: faker.person.jobTitle(),
    permissions: [],
    ...props,
  }),

  build: (props?: Partial<typeof accessProfile.$inferInsert>) => ({
    description: faker.person.jobTitle(),
    ...props,
  }),

  create: async (props?: Partial<typeof accessProfile.$inferInsert>) => {
    const profileData = AccessProfileFactory.build(props)

    const [created] = await db.insert(accessProfile).values(profileData).returning()

    return created
  },
}

export { AccessProfileFactory }
