export class Permission {
  id?: number
  profileId: number
  moduleId: number

  constructor(props: Omit<Permission, 'id'>, id?: number) {
    this.id = id
    this.profileId = props.profileId
    this.moduleId = props.moduleId
  }
}
