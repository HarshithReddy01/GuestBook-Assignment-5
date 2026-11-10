import { useId, useState, type KeyboardEvent, type SubmitEvent } from 'react'
import { MessageDraft } from '../domain/MessageDraft'
import { describeError } from '../lib/describeError'

const LOW_REMAINING_THRESHOLD = 50

interface MessageComposerProps {
  onPost(content: string): Promise<void>
}

export function MessageComposer({ onPost }: MessageComposerProps) {
  const fieldId = useId()
  const counterId = useId()
  const [content, setContent] = useState('')
  const [isPosting, setPosting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const remaining = MessageDraft.MAX_LENGTH - content.length
  const canPost = !isPosting && content.trim().length > 0

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    if (!canPost) return

    setPosting(true)
    setError(null)
    try {
      await onPost(content)
      setContent('')
    } catch (cause) {
      setError(describeError(cause))
    } finally {
      setPosting(false)
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>): void {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault()
      event.currentTarget.form?.requestSubmit()
    }
  }

  return (
    <form className="composer" onSubmit={(event) => void handleSubmit(event)} aria-busy={isPosting}>
      <label htmlFor={fieldId} className="visually-hidden">
        Your message
      </label>
      <textarea
        id={fieldId}
        value={content}
        onChange={(event) => setContent(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Write your message..."
        maxLength={MessageDraft.MAX_LENGTH}
        aria-describedby={counterId}
        readOnly={isPosting}
        required
      />
      <div className="composer__footer">
        <span
          id={counterId}
          className={remaining <= LOW_REMAINING_THRESHOLD ? 'counter counter--warning' : 'counter'}
        >
          {remaining} characters left · Ctrl+Enter to post
        </span>
        <button type="submit" className="button" disabled={!canPost}>
          {isPosting ? 'Posting…' : 'Post message'}
        </button>
      </div>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
    </form>
  )
}
