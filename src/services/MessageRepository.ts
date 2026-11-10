import type { PostgrestError } from '@supabase/supabase-js'
import { DataAccessError } from '../domain/errors'
import { Message } from '../domain/Message'
import type { MessageDraft } from '../domain/MessageDraft'
import type { MessageRow } from '../infrastructure/database.types'
import type { GuestbookClient } from '../infrastructure/supabaseClient'

const TABLE = 'messages'
const COLUMNS = 'id, username, avatar_url, content, created_at'

export interface MessagePage {
  readonly messages: readonly Message[]
  readonly nextCursor: string | null
}

export class MessageRepository {
  static readonly PAGE_SIZE = 25

  readonly #client: GuestbookClient

  constructor(client: GuestbookClient) {
    this.#client = client
  }

  async fetchPage(cursor: string | null = null, size = MessageRepository.PAGE_SIZE): Promise<MessagePage> {
    const base = this.#client.from(TABLE).select(COLUMNS)
    const filtered = cursor ? base.lt('created_at', cursor) : base
    const { data, error } = await filtered.order('created_at', { ascending: false }).limit(size + 1)

    MessageRepository.assertOk(error, 'Unable to load messages')

    const rows = (data ?? []).slice(0, size)
    const hasMore = (data?.length ?? 0) > size

    return {
      messages: rows.map(Message.fromRow),
      nextCursor: hasMore ? (rows.at(-1)?.created_at ?? null) : null,
    }
  }

  async create(draft: MessageDraft): Promise<Message> {
    const { data, error } = await this.#client
      .from(TABLE)
      .insert({ content: draft.content })
      .select(COLUMNS)
      .single()

    MessageRepository.assertOk(error, 'Unable to post your message')

    if (!data) throw new DataAccessError('Unable to post your message: no data returned')
    return Message.fromRow(data)
  }

  subscribeToNew(listener: (message: Message) => void): () => void {
    const channel = this.#client
      .channel(`messages-feed-${crypto.randomUUID()}`)
      .on<MessageRow>('postgres_changes', { event: 'INSERT', schema: 'public', table: TABLE }, (payload) => {
        listener(Message.fromRow(payload.new))
      })
      .subscribe()

    return () => {
      void this.#client.removeChannel(channel)
    }
  }

  private static assertOk(error: PostgrestError | null, context: string): void {
    if (error) throw new DataAccessError(`${context}: ${error.message}`, { cause: error })
  }
}
