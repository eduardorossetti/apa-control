import { CampaignTypeRepository } from '@/repositories/campaign-type.repository'
import { CampaignRepository } from '@/repositories/campaign.repository'
import { ReminderRepository } from '@/repositories/reminder.repository'
import { CreateCampaignUseCase } from './create-campaign'

export function makeCreateCampaignUseCase() {
  return new CreateCampaignUseCase(new CampaignRepository(), new CampaignTypeRepository(), new ReminderRepository())
}
