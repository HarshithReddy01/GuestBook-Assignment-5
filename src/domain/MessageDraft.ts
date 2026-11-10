import { ValidationError } from './errors'

export class MessageDraft {
  static readonly MAX_LENGTH = 1000

  readonly content: string

  private constructor(content: string) {
    this.content = content
  }

  static create(raw: string): MessageDraft {
    const content = raw.trim()

    if (content.length === 0) {
      throw new ValidationError('Your message cannot be empty.')
    }

    if (content.length > MessageDraft.MAX_LENGTH) {
      throw new ValidationError(`Your message cannot exceed ${MessageDraft.MAX_LENGTH} characters.`)
    }

    return new MessageDraft(content)
  }
}
