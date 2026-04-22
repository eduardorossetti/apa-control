import { CampaignRepository } from '@/repositories/campaign.repository'
import { ReminderRepository } from '@/repositories/reminder.repository'
import { CancelCampaignUseCase } from './cancel-campaign'

export function makeCancelCampaignUseCase() {
  return new CancelCampaignUseCase(new CampaignRepository(), new ReminderRepository())
}
