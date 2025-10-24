import type { AccessProfile } from '@/entities'
import type { AccessProfileRepository } from '@/repositories'

export class ListAccessProfilesUseCase {
  constructor(private accessProfileRepository: AccessProfileRepository) {}

  async execute(): Promise<[number, AccessProfile[]]> {
    const [items, count] = await this.accessProfileRepository.list()
    return [items, count]
  }
}
