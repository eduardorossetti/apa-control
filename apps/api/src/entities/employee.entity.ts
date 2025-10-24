export class Employee {
  id?: number
  name: string
  login: string
  cpf: string
  email?: string | null
  passwordHash: string
  streetName?: string | null
  streetNumber?: string | null
  district?: string | null
  city?: string | null
  state?: string | null
  postalCode?: string | null
  complement?: string | null
  phone1?: string | null
  phone2?: string | null
  profileId: number
  createdAt: Date
  activedAt?: Date | null
  disabledAt?: Date | null

  constructor(props: Omit<Employee, 'id'>, id?: number) {
    this.id = id
    this.name = props.name
    this.login = props.login
    this.cpf = props.cpf
    this.email = props.email
    this.passwordHash = props.passwordHash
    this.streetName = props.streetName
    this.streetNumber = props.streetNumber
    this.district = props.district
    this.city = props.city
    this.state = props.state
    this.postalCode = props.postalCode
    this.complement = props.complement
    this.phone1 = props.phone1
    this.phone2 = props.phone2
    this.profileId = props.profileId
    this.createdAt = props.createdAt
    this.activedAt = props.activedAt
    this.disabledAt = props.disabledAt
  }
}
