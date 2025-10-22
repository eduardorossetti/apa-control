import type { createAccessProfileSchema } from '@/http/controllers/access-profile/create-access-profile/create-access-profile.schema'
import type z from 'zod'

export type CreateAccessProfileData = z.infer<typeof createAccessProfileSchema>

export interface CreateAccessProfileDTO {
  id: number
}
