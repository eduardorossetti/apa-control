import type { TransactionTypeRepository } from '@/repositories'
import type { ListTransactionTypesDTO, ListTransactionTypesData } from './list-transaction-types.dto'

export class ListTransactionTypesUseCase {
  constructor(private transactionTypeRepository: TransactionTypeRepository) {}

  async execute(data: ListTransactionTypesData): Promise<[number, ListTransactionTypesDTO[]]> {
    const result = await this.transactionTypeRepository.list(data)
    return result
  }
}
