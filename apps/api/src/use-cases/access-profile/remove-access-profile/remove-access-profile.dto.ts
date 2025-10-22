import type { removeAccessProfileSchema } from '@/http/controllers/access-profile/remove-access-profile/remove-access-profile.schema'
import type z from 'zod'

export type RemoveAccessProfileData = z.infer<typeof removeAccessProfileSchema>
