export class AccessProfile {
  id?: number
  description: string

  constructor(props: Omit<AccessProfile, 'id'>, id?: number) {
    this.id = id
    this.description = props.description
  }
}
