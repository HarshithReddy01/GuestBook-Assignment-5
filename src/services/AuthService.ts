import type { AuthError, Session } from '@supabase/supabase-js'
import { AuthenticationError } from '../domain/errors'
import { GuestbookUser } from '../domain/GuestbookUser'
import type { GuestbookClient } from '../infrastructure/supabaseClient'

export type UserListener = (user: GuestbookUser | null) => void

export class AuthService {
  readonly #client: GuestbookClient
  readonly #redirectUrl: string

  constructor(client: GuestbookClient, redirectUrl: string) {
    this.#client = client
    this.#redirectUrl = redirectUrl
  }

  onUserChange(listener: UserListener): () => void {
    const { data } = this.#client.auth.onAuthStateChange((_event, session) => {
      listener(AuthService.toUser(session))
    })
    return () => data.subscription.unsubscribe()
  }

  async signInWithGitHub(): Promise<void> {
    const { error } = await this.#client.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: this.#redirectUrl },
    })
    AuthService.assertOk(error, 'Unable to start GitHub sign-in')
  }

  async signOut(): Promise<void> {
    const { error } = await this.#client.auth.signOut()
    AuthService.assertOk(error, 'Unable to sign out')
  }

  private static toUser(session: Session | null): GuestbookUser | null {
    return session ? GuestbookUser.fromAuthUser(session.user) : null
  }

  private static assertOk(error: AuthError | null, context: string): void {
    if (error) throw new AuthenticationError(`${context}: ${error.message}`, { cause: error })
  }
}
