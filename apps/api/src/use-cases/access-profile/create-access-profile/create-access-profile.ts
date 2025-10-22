import { AccessProfile } from '@/entities'
import type { AccessProfileRepository } from '@/repositories/access-profile.repository'
import type { CreateAccessProfileDTO, CreateAccessProfileData } from './create-access-profile.dto'

export class CreateAccessProfileUseCase {
  constructor(private accessProfileRepository: AccessProfileRepository) {}

  async execute(data: CreateAccessProfileData): Promise<CreateAccessProfileDTO> {
    const profile = await this.accessProfileRepository.create(new AccessProfile({ ...data }), data.permissions, null)

    return { id: profile.id }
  }
}
