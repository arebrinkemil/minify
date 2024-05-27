import { z } from 'zod'

const date = new Date()
date.setHours(0, 0, 0, 0)

export const updateUrlSchema = z.object({
  user_id: z.string(),
  original_url: z.string().url(),
  expires_at: z.date().min(date).optional(),
  max_views: z.number().min(1).optional(),
  short_url: z.string(),
})
