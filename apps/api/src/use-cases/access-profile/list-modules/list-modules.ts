import type { ModuleRepository } from '@/repositories/module.repository'

export class ListModulesUseCase {
  constructor(private moduleRepository: ModuleRepository) {}

  async execute() {
    const items = await this.moduleRepository.findAll()
    return items
  }
}
