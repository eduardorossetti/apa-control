import { authorize } from '@/http/middlewares/authorize'
import type { FastifyInstance } from 'fastify'
import { getRemindersUnreadController } from './get-reminders-unread/get-reminders-unread.controller'
import { listRemindersController } from './list-reminders/list-reminders.controller'
import { readRemindersController } from './read-reminders/read-reminders.controller'

export async function reminderRoutes(app: FastifyInstance) {
  const reminderModules = ['AdminPanel', 'Appointments', 'ClinicalProcedures', 'Campaigns', 'Financial', 'Expenses']

  app.get('/reminder.list', authorize(...reminderModules), listRemindersController)
  app.get('/reminder.unread', authorize(...reminderModules), getRemindersUnreadController)
  app.post('/reminder.read', authorize(...reminderModules), readRemindersController)
}
