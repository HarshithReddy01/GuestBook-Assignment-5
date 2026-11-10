import type { AppConfig } from '../config/appConfig'
import { createGuestbookClient } from '../infrastructure/supabaseClient'
import { AuthService } from '../services/AuthService'
import { MessageRepository } from '../services/MessageRepository'

export interface Services {
  readonly auth: AuthService
  readonly messages: MessageRepository
}

export function createServices(config: AppConfig): Services {
  const client = createGuestbookClient(config)

  return {
    auth: new AuthService(client, config.authRedirectUrl),
    messages: new MessageRepository(client),
  }
}
