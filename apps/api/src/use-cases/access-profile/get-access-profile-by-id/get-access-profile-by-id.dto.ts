import type { getAccessProfileByIdSchema } from '@/http/controllers/access-profile/get-access-profile-by-id/get-access-profile-by-id.schema'
import type z from 'zod'

export type GetAccessProfileByIdData = z.infer<typeof getAccessProfileByIdSchema>

export interface GetAccessProfileByIdDTO {
  id: number
  description: string
  permissions: number[]
}
