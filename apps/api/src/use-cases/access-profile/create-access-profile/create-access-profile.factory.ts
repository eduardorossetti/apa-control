import { AccessProfileRepository } from '@/repositories/access-profile.repository'
import { CreateAccessProfileUseCase } from '@/use-cases/access-profile/create-access-profile/create-access-profile'

export function makeCreateAccessProfileUseCase() {
  const accessProfileRepository = new AccessProfileRepository()
  const createAccessProfileUseCase = new CreateAccessProfileUseCase(accessProfileRepository)

  return createAccessProfileUseCase
}
