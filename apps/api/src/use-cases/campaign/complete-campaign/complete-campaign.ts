import { db } from '@/database/client'
import { CampaignStatus } from '@/database/schema/enums/campaign-status'
import { ReminderEntityType } from '@/database/schema/enums/reminder-entity-type'
import type { CampaignRepository } from '@/repositories/campaign.repository'
import type { ReminderRepository } from '@/repositories/reminder.repository'
import { ApiError } from '@/utils/api-error'
import type { CompleteCampaignData } from './complete-campaign.dto'

export class CompleteCampaignUseCase {
  constructor(
    private campaignRepository: CampaignRepository,
    private reminderRepository: ReminderRepository,
  ) {}

  async execute({ id }: CompleteCampaignData): Promise<void> {
    const campaign = await this.campaignRepository.findByIdOrThrow(id)

    if (campaign.status !== CampaignStatus.ACTIVE) {
      throw new ApiError('Apenas campanhas ativas podem ser concluídas.', 400)
    }

    await db.transaction(async (tx) => {
      await this.campaignRepository.update(
        id,
        {
          status: CampaignStatus.COMPLETED,
          updatedAt: new Date(),
        },
        tx,
      )
      await this.reminderRepository.deleteByEntity(ReminderEntityType.CAMPAIGN, [id], tx)
    })
  }
}
