import { makeGetRemindersUnreadUseCase } from '@/use-cases/reminder/get-reminders-unread/get-reminders-unread.factory'
import type { FastifyRequest } from 'fastify'

export async function getRemindersUnreadController(request: FastifyRequest) {
  const useCase = makeGetRemindersUnreadUseCase()
  return await useCase.execute(request.user.id)
}
