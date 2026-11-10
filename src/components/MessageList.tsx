import { useId } from 'react'
import type { MessagesController } from '../hooks/useMessages'
import { MessageCard } from './MessageCard'

interface MessageListProps {
  feed: MessagesController
}

export function MessageList({ feed }: MessageListProps) {
  const headingId = useId()

  return (
    <section className="messages" aria-labelledby={headingId}>
      <h2 id={headingId}>Messages</h2>
      <MessageListBody feed={feed} />
    </section>
  )
}

function MessageListBody({ feed }: MessageListProps) {
  if (feed.status === 'loading') {
    return (
      <p className="muted" role="status">
        Loading messages…
      </p>
    )
  }

  if (feed.status === 'failed') {
    return (
      <p className="error" role="alert">
        {feed.error}
      </p>
    )
  }

  if (feed.messages.length === 0) {
    return <p className="muted">No messages yet. Be the first!</p>
  }

  return (
    <>
      <ol className="message-list">
        {feed.messages.map((message) => (
          <li key={message.id}>
            <MessageCard message={message} />
          </li>
        ))}
      </ol>

      {feed.error && (
        <p className="error" role="alert">
          {feed.error}
        </p>
      )}

      {feed.hasMore && (
        <button
          type="button"
          className="button button--secondary load-more"
          onClick={() => void feed.loadMore()}
          disabled={feed.isLoadingMore}
        >
          {feed.isLoadingMore ? 'Loading…' : 'Load older messages'}
        </button>
      )}
    </>
  )
}
