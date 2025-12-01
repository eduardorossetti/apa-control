import { CampaignType } from '@/entities'
import type { CampaignTypeRepository } from '@/repositories/campaign-type.repository'
import { ApiError } from '@/utils/api-error'
import type { CreateCampaignTypeDTO, CreateCampaignTypeData } from './create-campaign-type.dto'

export class CreateCampaignTypeUseCase {
  constructor(private campaignTypeRepository: CampaignTypeRepository) {}

  async execute(data: CreateCampaignTypeData): Promise<CreateCampaignTypeDTO> {
    if (await this.campaignTypeRepository.hasName(data.name)) {
      throw new ApiError('Já existe um tipo de campanha cadastrado com o nome informado.', 409)
    }

    const campaignType = new CampaignType({
      name: data.name,
      description: data.description,
      active: data.active,
      createdAt: new Date(),
    })

    const result = await this.campaignTypeRepository.create(campaignType)

    return { id: result.id }
  }
}
