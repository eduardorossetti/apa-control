export class Module {
  id: number
  name: string
  title: string
  parentId?: number | null

  constructor(props: Omit<Module, 'id'>, id: number) {
    this.id = id
    this.name = props.name
    this.title = props.title
    this.parentId = props.parentId
  }
}
