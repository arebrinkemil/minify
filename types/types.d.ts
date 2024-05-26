export type DBUrlRow = {
  user_id: string | null
  original_url: string
  short_url: string
  created_at: string
  expires_at: string
  views: number
  max_views: number
}
