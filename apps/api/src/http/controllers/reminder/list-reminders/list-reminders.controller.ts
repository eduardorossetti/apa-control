import { makeListRemindersUseCase } from '@/use-cases/reminder/list-reminders/list-reminders.factory'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { listRemindersSchema } from './list-reminders.schema'

export async function listRemindersController(request: FastifyRequest, reply: FastifyReply) {
  const data = listRemindersSchema.parse(request.query)
  const useCase = makeListRemindersUseCase()
  const [count, items] = await useCase.execute({ ...data, employeeId: request.user.id })

  reply.header('X-Total-Count', count)
  return items
}
