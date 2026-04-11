export class Animal {
  id?: number
  name: string
  species: string
  breed?: string | null
  size: string
  sex: string
  birthYear: number | null
  birthMonth: number | null
  healthCondition: string
  entryDate: string
  observations?: string | null
  status: string
  rescueAt?: Date | null
  createdAt: Date
  updatedAt?: Date | null

  constructor(props: Omit<Animal, 'id'>, id?: number) {
    this.id = id
    this.name = props.name
    this.species = props.species
    this.breed = props.breed
    this.size = props.size
    this.sex = props.sex
    this.birthYear = props.birthYear
    this.birthMonth = props.birthMonth
    this.healthCondition = props.healthCondition
    this.entryDate = props.entryDate
    this.observations = props.observations
    this.status = props.status
    this.rescueAt = props.rescueAt
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
  }
}
