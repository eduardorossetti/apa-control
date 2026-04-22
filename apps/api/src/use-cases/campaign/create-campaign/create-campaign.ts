import Decimal from 'decimal.js'

import { db } from '@/database/client'
import { CampaignStatus } from '@/database/schema/enums/campaign-status'
import { ReminderEntityType } from '@/database/schema/enums/reminder-entity-type'
import { Campaign, Reminder } from '@/entities'
import type { CampaignTypeRepository } from '@/repositories/campaign-type.repository'
import type { CampaignRepository } from '@/repositories/campaign.repository'
import type { ReminderRepository } from '@/repositories/reminder.repository'
import { ApiError } from '@/utils/api-error'
import { buildCampaignReminderMessage } from '../../reminder/builders'
import type { CreateCampaignData } from './create-campaign.dto'

export class CreateCampaignUseCase {
  constructor(
    private campaignRepository: CampaignRepository,
    private campaignTypeRepository: CampaignTypeRepository,
    private reminderRepository: ReminderRepository,
  ) {}

  async execute(data: CreateCampaignData, employeeId: number): Promise<number> {
    const campaignType = await this.campaignTypeRepository.findById(data.campaignTypeId)
    if (!campaignType) throw new ApiError('Tipo de campanha não encontrado.', 404)
    if (!campaignType.active) throw new ApiError('Tipo de campanha inativo.', 409)
    if (new Date(data.startDate) > new Date(data.endDate)) {
      throw new ApiError('A data inicial deve ser menor ou igual à data final.', 400)
    }

    return await db.transaction(async (tx) => {
      const [result] = await this.campaignRepository.create(
        new Campaign({
          campaignTypeId: data.campaignTypeId,
          employeeId,
          title: data.title,
          description: data.description,
          startDate: data.startDate,
          endDate: data.endDate,
          fundraisingGoal: data.fundraisingGoal != null ? new Decimal(data.fundraisingGoal) : null,
          status: CampaignStatus.ACTIVE,
          proof: data.proof ?? null,
          observations: data.observations ?? null,
          createdAt: new Date(),
          updatedAt: null,
        }),
        tx,
      )

      if (new Date(data.endDate) >= new Date()) {
        const reminderMsg = buildCampaignReminderMessage({ title: data.title, endDate: data.endDate })
        await this.reminderRepository.create(
          new Reminder({
            entityType: ReminderEntityType.CAMPAIGN,
            entityId: result!.id,
            employeeId,
            title: reminderMsg.title,
            message: reminderMsg.message,
            readAt: null,
            createdAt: new Date(),
          }),
          tx,
        )
      }

      return result!.id
    })
  }
}
