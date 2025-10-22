import { makeListModulesUseCase } from '@/use-cases/access-profile/list-modules/list-modules.factory'

export async function listModulesController() {
  const listModulesUseCase = makeListModulesUseCase()
  const result = await listModulesUseCase.execute()
  return result
}
