import type { Decimal } from 'decimal.js'

export class Adopter {
  id?: number
  name: string
  cpf: string
  email: string
  phone: string
  address: string
  familyIncome: Decimal
  animalExperience: boolean
  approvalStatus: string
  createdAt: Date
  updatedAt?: Date | null

  constructor(props: Omit<Adopter, 'id'>, id?: number) {
    this.id = id
    this.name = props.name
    this.cpf = props.cpf
    this.email = props.email
    this.phone = props.phone
    this.address = props.address
    this.familyIncome = props.familyIncome
    this.animalExperience = props.animalExperience
    this.approvalStatus = props.approvalStatus
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
  }
}
