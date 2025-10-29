import { authorize } from '@/http/middlewares/authorize'
import type { FastifyInstance } from 'fastify'
import { createAccessProfileController } from './create-access-profile/create-access-profile.controller'
import { getAccessProfileByIdController } from './get-access-profile-by-id/get-access-profile-by-id.controller'
import { listAccessProfilesController } from './list-access-profiles/list-access-profiles.controller'
import { listModulesController } from './list-modules/list-modules.controller'
import { removeAccessProfileController } from './remove-access-profile/remove-access-profile.controller'
import { updateAccessProfileController } from './update-access-profile/update-access-profile.controller'

export async function accessProfileRoutes(app: FastifyInstance) {
  app.post('/profile.add', authorize('AdminPanel', 'AccessProfiles'), createAccessProfileController)
  app.get('/profile.key/:id', authorize('AdminPanel', 'AccessProfiles'), getAccessProfileByIdController)
  app.get('/profile.list', authorize('AdminPanel', 'AccessProfiles'), listAccessProfilesController)
  app.get('/profile.modules', authorize('AdminPanel', 'AccessProfiles'), listModulesController)
  app.delete('/profile.delete/:id', authorize('AdminPanel', 'AccessProfiles'), removeAccessProfileController)
  app.put('/profile.update', authorize('AdminPanel', 'AccessProfiles'), updateAccessProfileController)
}
