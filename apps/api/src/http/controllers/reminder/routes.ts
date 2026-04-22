import { authorize } from '@/http/middlewares/authorize'
import type { FastifyInstance } from 'fastify'
import { getRemindersUnreadController } from './get-reminders-unread/get-reminders-unread.controller'
import { listRemindersController } from './list-reminders/list-reminders.controller'
import { readRemindersController } from './read-reminders/read-reminders.controller'

export async function reminderRoutes(app: FastifyInstance) {
  app.get('/reminder.list', authorize('AdminPanel', 'Appointments'), listRemindersController)
  app.get('/reminder.unread', authorize('AdminPanel', 'Appointments'), getRemindersUnreadController)
  app.post('/reminder.read', authorize('AdminPanel', 'Appointments'), readRemindersController)
}
