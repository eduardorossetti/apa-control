import { AccessProfileRepository } from '@/repositories/access-profile.repository'
import { ListAccessProfilesPostUseCase } from '@/use-cases/access-profile/list-access-profiles-post/list-access-profiles'

export function makeListAccessProfilesPostUseCase() {
  const accessProfileRepository = new AccessProfileRepository()
  const listAccessProfilesPostUseCase = new ListAccessProfilesPostUseCase(accessProfileRepository)

  return listAccessProfilesPostUseCase
}
