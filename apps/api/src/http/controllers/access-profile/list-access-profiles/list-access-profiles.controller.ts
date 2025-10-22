import { makeListAccessProfilesUseCase } from '@/use-cases/access-profile/list-access-profiles/list-access-profiles.factory'

export async function listAccessProfilesController() {
  const listAccessProfilesUseCase = makeListAccessProfilesUseCase()
  const result = await listAccessProfilesUseCase.execute()
  return result
}
