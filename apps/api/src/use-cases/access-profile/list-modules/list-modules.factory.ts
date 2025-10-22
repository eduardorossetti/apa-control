import { ModuleRepository } from '@/repositories/module.repository'
import { ListModulesUseCase } from './list-modules'

export function makeListModulesUseCase() {
  const moduleRepository = new ModuleRepository()
  const listModulesUseCase = new ListModulesUseCase(moduleRepository)

  return listModulesUseCase
}
