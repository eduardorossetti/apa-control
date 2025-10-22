export class CampaignType {
  id?: number
  name: string
  description?: string | null
  category: string
  active: boolean
  createdAt: Date

  constructor(props: Omit<CampaignType, 'id'>, id?: number) {
    this.id = id
    this.name = props.name
    this.description = props.description
    this.category = props.category
    this.active = props.active
    this.createdAt = props.createdAt
  }
}
