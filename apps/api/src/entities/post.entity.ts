export class Post {
  id?: number
  employeeId: number
  title: string
  content: string
  type: string
  publicationDate: Date
  status: string
  relatedAnimals?: string | null
  createdAt: Date
  updatedAt?: Date | null

  constructor(props: Omit<Post, 'id'>, id?: number) {
    this.id = id
    this.employeeId = props.employeeId
    this.title = props.title
    this.content = props.content
    this.type = props.type
    this.publicationDate = props.publicationDate
    this.status = props.status
    this.relatedAnimals = props.relatedAnimals
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
  }
}
