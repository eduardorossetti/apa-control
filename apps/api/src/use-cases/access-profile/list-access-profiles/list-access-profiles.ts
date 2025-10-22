import type { AccessProfileRepository } from '@/repositories'
import type { ListAccessProfilesDTO } from './list-access-profiles.dto'

export class ListAccessProfilesUseCase {
  constructor(private accessProfileRepository: AccessProfileRepository) {}

  async execute(): Promise<ListAccessProfilesDTO[]> {
    const items = await this.accessProfileRepository.list()
    return items.map((item) => ({ id: item.id, title: item.description }))
  }
}
