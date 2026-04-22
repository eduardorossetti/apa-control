import { app } from '@/app'
import { env } from '@/env'
import { ReminderRepository } from '@/repositories/reminder.repository'

app.listen({ host: '0.0.0.0', port: env.PORT ?? 3333 }, (error) => {
  if (error) {
    console.error(error)
    process.exit(1)
  } else {
    console.info(`🚀 Server is running at http://localhost:${env.PORT ?? 3333}`)
    process.send?.('ready')

    const reminderRepository = new ReminderRepository()
    reminderRepository.purgeInvalidReminders().catch(console.error)
    setInterval(
      () => {
        reminderRepository.purgeInvalidReminders().catch(console.error)
      },
      1000 * 60 * 60 * 24,
    )
  }
})
