import { db } from '@/database/client'
import { CampaignStatus } from '@/database/schema/enums/campaign-status'
import { ReminderEntityType } from '@/database/schema/enums/reminder-entity-type'
import type { CampaignRepository } from '@/repositories/campaign.repository'
import type { ReminderRepository } from '@/repositories/reminder.repository'
import { ApiError } from '@/utils/api-error'
import type { CancelCampaignData } from './cancel-campaign.dto'

export class CancelCampaignUseCase {
  constructor(
    private campaignRepository: CampaignRepository,
    private reminderRepository: ReminderRepository,
  ) {}

  async execute({ id }: CancelCampaignData): Promise<void> {
    const campaign = await this.campaignRepository.findByIdOrThrow(id)

    if (campaign.status !== CampaignStatus.ACTIVE) {
      throw new ApiError('Apenas campanhas ativas podem ser canceladas.', 400)
    }

    await db.transaction(async (tx) => {
      await this.campaignRepository.update(
        id,
        {
          status: CampaignStatus.CANCELLED,
          updatedAt: new Date(),
        },
        tx,
      )
      await this.reminderRepository.deleteByEntity(ReminderEntityType.CAMPAIGN, [id], tx)
    })
  }
}
