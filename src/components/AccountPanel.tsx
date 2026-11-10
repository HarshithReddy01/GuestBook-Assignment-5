import type { AuthController } from '../hooks/useAuth'
import { Avatar } from './Avatar'
import { GitHubIcon } from './GitHubIcon'

interface AccountPanelProps {
  auth: AuthController
}

export function AccountPanel({ auth }: AccountPanelProps) {
  const { status, isPending, error } = auth

  return (
    <div className="account">
      {status.kind === 'loading' && (
        <p className="muted" role="status">
          Checking your session…
        </p>
      )}

      {status.kind === 'anonymous' && (
        <button
          type="button"
          className="button button--github"
          onClick={() => void auth.signIn()}
          disabled={isPending}
        >
          <GitHubIcon />
          {isPending ? 'Redirecting to GitHub…' : 'Sign in with GitHub'}
        </button>
      )}

      {status.kind === 'authenticated' && (
        <div className="account__profile">
          <Avatar name={status.user.username} src={status.user.avatarUrl} />
          <span>
            Signed in as <strong>{status.user.username}</strong>
          </span>
          <button
            type="button"
            className="button button--secondary"
            onClick={() => void auth.signOut()}
            disabled={isPending}
          >
            Sign out
          </button>
        </div>
      )}

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
