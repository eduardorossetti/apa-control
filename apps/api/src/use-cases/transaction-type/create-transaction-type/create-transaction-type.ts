import { TransactionType } from '@/entities'
import type { TransactionTypeRepository } from '@/repositories/transaction-type.repository'
import { ApiError } from '@/utils/api-error'
import type { CreateTransactionTypeDTO, CreateTransactionTypeData } from './create-transaction-type.dto'

export class CreateTransactionTypeUseCase {
  constructor(private transactionTypeRepository: TransactionTypeRepository) {}

  async execute(data: CreateTransactionTypeData): Promise<CreateTransactionTypeDTO> {
    if (await this.transactionTypeRepository.hasName(data.name)) {
      throw new ApiError('Já existe um tipo de transação cadastrado com o nome informado.', 409)
    }

    const transactionType = new TransactionType({
      name: data.name,
      category: data.category,
      description: data.description,
      active: data.active,
      createdAt: new Date(),
    })

    const result = await this.transactionTypeRepository.create(transactionType)

    return { id: result.id }
  }
}
