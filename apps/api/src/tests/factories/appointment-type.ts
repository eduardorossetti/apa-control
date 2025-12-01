import { db } from '@/database/client'
import { appointmentType } from '@/database/schema/appointment-type'
import { UrgencyLevelValues } from '@/database/schema/enums/urgency-level'
import { faker } from '@/tests/faker'

import type { CreateAppointmentTypeData } from '@/use-cases/appointment-type/create-appointment-type/create-appointment-type.dto'

const AppointmentTypeFactory = {
  buildCreate: (props?: Partial<CreateAppointmentTypeData>): CreateAppointmentTypeData => ({
    name: faker.lorem.words(3),
    description: faker.lorem.paragraph(),
    urgency: faker.helpers.arrayElement(UrgencyLevelValues),
    active: true,
    ...props,
  }),

  build: (props?: Partial<typeof appointmentType.$inferInsert>) => ({
    name: faker.lorem.words(3),
    description: faker.lorem.paragraph(),
    urgency: faker.helpers.arrayElement(UrgencyLevelValues),
    active: true,
    createdAt: new Date(),
    ...props,
  }),

  create: async (props?: Partial<typeof appointmentType.$inferInsert>) => {
    const data = AppointmentTypeFactory.build(props)

    const [created] = await db.insert(appointmentType).values(data).returning()

    return created
  },
}

export { AppointmentTypeFactory }
