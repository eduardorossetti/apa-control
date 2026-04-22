import { CampaignRepository } from '@/repositories/campaign.repository'
import { ReminderRepository } from '@/repositories/reminder.repository'
import { CompleteCampaignUseCase } from './complete-campaign'

export function makeCompleteCampaignUseCase() {
  return new CompleteCampaignUseCase(new CampaignRepository(), new ReminderRepository())
}
