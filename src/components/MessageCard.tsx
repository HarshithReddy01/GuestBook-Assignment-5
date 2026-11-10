import type { Message } from '../domain/Message'
import { formatTimestamp } from '../lib/formatTimestamp'
import { Avatar } from './Avatar'

interface MessageCardProps {
  message: Message
}

export function MessageCard({ message }: MessageCardProps) {
  return (
    <article className="message">
      <header className="message__header">
        <div className="message__author">
          <Avatar name={message.authorName} src={message.authorAvatarUrl} size={32} />
          <strong>{message.authorName}</strong>
        </div>
        <time dateTime={message.createdAt.toISOString()}>{formatTimestamp(message.createdAt)}</time>
      </header>
      <p className="message__body">{message.content}</p>
    </article>
  )
}
