import { Message } from './Message'

export class MessageFeed {
  static readonly EMPTY = new MessageFeed([])

  readonly items: readonly Message[]

  private constructor(items: readonly Message[]) {
    this.items = items
  }

  get isEmpty(): boolean {
    return this.items.length === 0
  }

  merge(incoming: readonly Message[]): MessageFeed {
    if (incoming.length === 0) return this

    const byId = new Map(this.items.map((message) => [message.id, message]))
    for (const message of incoming) byId.set(message.id, message)

    return new MessageFeed([...byId.values()].sort(Message.compareNewestFirst))
  }
}
