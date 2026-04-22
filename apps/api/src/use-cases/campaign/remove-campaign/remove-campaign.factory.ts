import { CampaignRepository } from '@/repositories/campaign.repository'
import { ReminderRepository } from '@/repositories/reminder.repository'
import { RemoveCampaignUseCase } from './remove-campaign'

export function makeRemoveCampaignUseCase() {
  return new RemoveCampaignUseCase(new CampaignRepository(), new ReminderRepository())
}
