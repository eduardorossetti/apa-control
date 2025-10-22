export class TransactionType {
  id?: number
  name: string
  category: string
  description?: string | null
  active: boolean
  createdAt: Date

  constructor(props: Omit<TransactionType, 'id'>, id?: number) {
    this.id = id
    this.name = props.name
    this.category = props.category
    this.description = props.description
    this.active = props.active
    this.createdAt = props.createdAt
  }
}
