import type { Decimal } from 'decimal.js'

export class ProcedureType {
  id?: number
  name: string
  description?: string | null
  category: string
  averageCost: Decimal
  active: boolean
  createdAt: Date

  constructor(props: Omit<ProcedureType, 'id'>, id?: number) {
    this.id = id
    this.name = props.name
    this.description = props.description
    this.category = props.category
    this.averageCost = props.averageCost
    this.active = props.active
    this.createdAt = props.createdAt
  }
}
