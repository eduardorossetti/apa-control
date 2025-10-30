import { authorize } from '@/http/middlewares/authorize'
import type { FastifyInstance } from 'fastify'
import { createAnimalController } from './create-animal/create-animal.controller'
import { getAnimalByIdController } from './get-animal-by-id/get-animal-by-id.controller'
import { listAnimalsController } from './list-animals/list-animals.controller'
import { removeAnimalController } from './remove-animal/remove-animal.controller'
import { updateAnimalController } from './update-animal/update-animal.controller'

export async function animalRoutes(app: FastifyInstance) {
  app.post('/animal.add', authorize('AdminPanel', 'Animals'), createAnimalController)
  app.put('/animal.update', authorize('AdminPanel', 'Animals'), updateAnimalController)
  app.get('/animal.list', authorize('AdminPanel', 'Animals'), listAnimalsController)
  app.get('/animal.key/:id', authorize('AdminPanel', 'Animals'), getAnimalByIdController)
  app.delete('/animal.delete/:id', authorize('AdminPanel', 'Animals'), removeAnimalController)
}
