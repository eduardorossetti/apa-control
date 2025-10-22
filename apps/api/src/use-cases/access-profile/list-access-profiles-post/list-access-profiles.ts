import type { AccessProfileRepository } from '@/repositories'
import type { ApiQuery } from '@/utils/drizzle/api-query-schema'

export class ListAccessProfilesPostUseCase {
  constructor(private accessProfileRepository: AccessProfileRepository) {}

  async execute(query: ApiQuery) {
    const data = await this.accessProfileRepository.listPost(query)
    return data
  }
}
