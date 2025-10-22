export class VeterinaryClinic {
  id?: number
  name: string
  cnpj: string
  phone: string
  address: string
  responsible: string
  specialties?: string | null
  active: boolean
  registrationDate: Date

  constructor(props: Omit<VeterinaryClinic, 'id'>, id?: number) {
    this.id = id
    this.name = props.name
    this.cnpj = props.cnpj
    this.phone = props.phone
    this.address = props.address
    this.responsible = props.responsible
    this.specialties = props.specialties
    this.active = props.active
    this.registrationDate = props.registrationDate
  }
}
