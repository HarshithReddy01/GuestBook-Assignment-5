import type { MessageRow } from '../infrastructure/database.types'

export class Message {
  readonly id: string
  readonly authorName: string
  readonly authorAvatarUrl: string | null
  readonly content: string
  readonly createdAt: Date

  constructor(id: string, authorName: string, authorAvatarUrl: string | null, content: string, createdAt: Date) {
    this.id = id
    this.authorName = authorName
    this.authorAvatarUrl = authorAvatarUrl
    this.content = content
    this.createdAt = createdAt
  }

  static fromRow(row: MessageRow): Message {
    return new Message(row.id, row.username, row.avatar_url, row.content, new Date(row.created_at))
  }

  static compareNewestFirst(a: Message, b: Message): number {
    return b.createdAt.getTime() - a.createdAt.getTime()
  }
}
