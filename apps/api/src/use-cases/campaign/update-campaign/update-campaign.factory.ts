import { CampaignTypeRepository } from '@/repositories/campaign-type.repository'
import { CampaignRepository } from '@/repositories/campaign.repository'
import { ReminderRepository } from '@/repositories/reminder.repository'
import { UpdateCampaignUseCase } from './update-campaign'

export function makeUpdateCampaignUseCase() {
  return new UpdateCampaignUseCase(new CampaignRepository(), new CampaignTypeRepository(), new ReminderRepository())
}
