import { AccessProfileRepository } from '@/repositories/access-profile.repository'
import { ListAccessProfilesUseCase } from '@/use-cases/access-profile/list-access-profiles/list-access-profiles'

export function makeListAccessProfilesUseCase() {
  const accessProfileRepository = new AccessProfileRepository()
  const listAccessProfilesUseCase = new ListAccessProfilesUseCase(accessProfileRepository)

  return listAccessProfilesUseCase
}
