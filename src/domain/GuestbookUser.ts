import type { User } from '@supabase/supabase-js'

const FALLBACK_USERNAME = 'GitHub User'
const USERNAME_KEYS = ['user_name', 'preferred_username', 'name'] as const

export class GuestbookUser {
  readonly id: string
  readonly username: string
  readonly avatarUrl: string | null

  constructor(id: string, username: string, avatarUrl: string | null) {
    this.id = id
    this.username = username
    this.avatarUrl = avatarUrl
  }

  static fromAuthUser(user: User): GuestbookUser {
    const metadata: Record<string, unknown> = user.user_metadata
    return new GuestbookUser(
      user.id,
      GuestbookUser.resolveUsername(metadata),
      GuestbookUser.readString(metadata, 'avatar_url'),
    )
  }

  private static resolveUsername(metadata: Record<string, unknown>): string {
    for (const key of USERNAME_KEYS) {
      const value = GuestbookUser.readString(metadata, key)
      if (value) return value
    }
    return FALLBACK_USERNAME
  }

  private static readString(metadata: Record<string, unknown>, key: string): string | null {
    const value = metadata[key]
    return typeof value === 'string' && value.trim() !== '' ? value.trim() : null
  }
}
