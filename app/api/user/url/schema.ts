import { z } from 'zod'

const date = new Date()
date.setHours(0, 0, 0, 0)

export const updateUserURlSchema = z.object({
  original_url: z.string().url(),
  expires_at: z.date().min(date).optional(),
  user_id: z.string().uuid(),
})
