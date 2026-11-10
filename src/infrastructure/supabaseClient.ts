import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { AppConfig } from '../config/appConfig'
import type { Database } from './database.types'

export type GuestbookClient = SupabaseClient<Database>

export function createGuestbookClient(config: AppConfig): GuestbookClient {
  return createClient<Database>(config.supabaseUrl, config.supabaseKey, {
    auth: {
      flowType: 'pkce',
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })
}
