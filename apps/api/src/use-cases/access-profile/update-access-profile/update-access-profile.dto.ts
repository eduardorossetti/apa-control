import type { updateAccessProfileSchema } from '@/http/controllers/access-profile/update-access-profile/update-access-profile.schema'
import type z from 'zod'

export type UpdateAccessProfileData = z.infer<typeof updateAccessProfileSchema>
