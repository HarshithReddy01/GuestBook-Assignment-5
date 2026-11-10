import { useEffect, useReducer } from 'react'
import { useServices } from '../app/servicesContext'
import type { Message } from '../domain/Message'
import { MessageDraft } from '../domain/MessageDraft'
import { MessageFeed } from '../domain/MessageFeed'
import { describeError } from '../lib/describeError'
import type { MessagePage } from '../services/MessageRepository'

export type FeedStatus = 'loading' | 'ready' | 'failed'

export interface MessagesController {
  readonly messages: readonly Message[]
  readonly status: FeedStatus
  readonly hasMore: boolean
  readonly isLoadingMore: boolean
  readonly error: string | null
  loadMore(): Promise<void>
  post(content: string): Promise<void>
}

interface FeedState {
  readonly feed: MessageFeed
  readonly status: FeedStatus
  readonly nextCursor: string | null
  readonly isLoadingMore: boolean
  readonly error: string | null
}

type FeedAction =
  | { readonly type: 'pageLoaded'; readonly page: MessagePage }
  | { readonly type: 'loadFailed'; readonly error: string }
  | { readonly type: 'loadMoreStarted' }
  | { readonly type: 'received'; readonly message: Message }

const INITIAL_STATE: FeedState = {
  feed: MessageFeed.EMPTY,
  status: 'loading',
  nextCursor: null,
  isLoadingMore: false,
  error: null,
}

function feedReducer(state: FeedState, action: FeedAction): FeedState {
  switch (action.type) {
    case 'pageLoaded':
      return {
        feed: state.feed.merge(action.page.messages),
        status: 'ready',
        nextCursor: action.page.nextCursor,
        isLoadingMore: false,
        error: null,
      }
    case 'loadFailed':
      return {
        ...state,
        status: state.status === 'loading' ? 'failed' : state.status,
        isLoadingMore: false,
        error: action.error,
      }
    case 'loadMoreStarted':
      return { ...state, isLoadingMore: true, error: null }
    case 'received':
      return { ...state, feed: state.feed.merge([action.message]) }
  }
}

export function useMessages(): MessagesController {
  const { messages: repository } = useServices()
  const [state, dispatch] = useReducer(feedReducer, INITIAL_STATE)

  useEffect(() => {
    let active = true

    repository.fetchPage().then(
      (page) => {
        if (active) dispatch({ type: 'pageLoaded', page })
      },
      (cause: unknown) => {
        if (active) dispatch({ type: 'loadFailed', error: describeError(cause) })
      },
    )

    const unsubscribe = repository.subscribeToNew((message) => dispatch({ type: 'received', message }))

    return () => {
      active = false
      unsubscribe()
    }
  }, [repository])

  async function loadMore(): Promise<void> {
    if (!state.nextCursor || state.isLoadingMore) return

    dispatch({ type: 'loadMoreStarted' })
    try {
      dispatch({ type: 'pageLoaded', page: await repository.fetchPage(state.nextCursor) })
    } catch (cause) {
      dispatch({ type: 'loadFailed', error: describeError(cause) })
    }
  }

  async function post(content: string): Promise<void> {
    const message = await repository.create(MessageDraft.create(content))
    dispatch({ type: 'received', message })
  }

  return {
    messages: state.feed.items,
    status: state.status,
    hasMore: state.nextCursor !== null,
    isLoadingMore: state.isLoadingMore,
    error: state.error,
    loadMore,
    post,
  }
}
