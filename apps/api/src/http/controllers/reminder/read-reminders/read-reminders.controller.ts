import { makeReadRemindersUseCase } from '@/use-cases/reminder/read-reminders/read-reminders.factory'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { readRemindersSchema } from './read-reminders.schema'

export async function readRemindersController(request: FastifyRequest, reply: FastifyReply) {
  const { reminderIds } = readRemindersSchema.parse(request.body)
  const useCase = makeReadRemindersUseCase()
  await useCase.execute(request.user.id, reminderIds)
  return reply.status(204).send()
}
