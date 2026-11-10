import { AccountPanel } from '../components/AccountPanel'
import { MessageComposer } from '../components/MessageComposer'
import { MessageList } from '../components/MessageList'
import { PageLayout } from '../components/PageLayout'
import { useAuth } from '../hooks/useAuth'
import { useMessages } from '../hooks/useMessages'

export function App() {
  const auth = useAuth()
  const feed = useMessages()

  return (
    <PageLayout headerExtras={<AccountPanel auth={auth} />}>
      {auth.status.kind === 'authenticated' && <MessageComposer onPost={feed.post} />}
      {auth.status.kind === 'anonymous' && (
        <p className="muted sign-in-hint">Sign in with GitHub to leave a message.</p>
      )}
      <MessageList feed={feed} />
    </PageLayout>
  )
}
