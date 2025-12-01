import { db } from '@/database/client'
import { module } from '@/database/schema/module'
import { faker } from '@/tests/faker'

const ModuleFactory = {
  build: (props?: Partial<typeof module.$inferInsert>) => ({
    id: faker.number.int({ min: 1, max: 9999 }),
    name: faker.string.alpha({ length: 10 }),
    title: faker.lorem.words(3),
    parentId: null,
    ...props,
  }),

  create: async (props?: Partial<typeof module.$inferInsert>) => {
    const moduleData = ModuleFactory.build(props)

    await db.insert(module).values(moduleData).onConflictDoNothing()

    return moduleData
  },
}

export { ModuleFactory }
