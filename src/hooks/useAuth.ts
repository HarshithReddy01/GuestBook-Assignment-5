import { useEffect, useState } from 'react'
import { useServices } from '../app/servicesContext'
import type { GuestbookUser } from '../domain/GuestbookUser'
import { describeError } from '../lib/describeError'

export type AuthStatus =
  | { readonly kind: 'loading' }
  | { readonly kind: 'anonymous' }
  | { readonly kind: 'authenticated'; readonly user: GuestbookUser }

export interface AuthController {
  readonly status: AuthStatus
  readonly isPending: boolean
  readonly error: string | null
  signIn(): Promise<void>
  signOut(): Promise<void>
}

export function useAuth(): AuthController {
  const { auth } = useServices()
  const [status, setStatus] = useState<AuthStatus>({ kind: 'loading' })
  const [isPending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(
    () => auth.onUserChange((user) => setStatus(user ? { kind: 'authenticated', user } : { kind: 'anonymous' })),
    [auth],
  )

  useEffect(() => {
    const resetOnRestore = (event: PageTransitionEvent) => {
      if (event.persisted) setPending(false)
    }
    window.addEventListener('pageshow', resetOnRestore)
    return () => window.removeEventListener('pageshow', resetOnRestore)
  }, [])

  async function signIn(): Promise<void> {
    setError(null)
    setPending(true)
    try {
      await auth.signInWithGitHub()
    } catch (cause) {
      setError(describeError(cause))
      setPending(false)
    }
  }

  async function signOut(): Promise<void> {
    setError(null)
    setPending(true)
    try {
      await auth.signOut()
    } catch (cause) {
      setError(describeError(cause))
    } finally {
      setPending(false)
    }
  }

  return { status, isPending, error, signIn, signOut }
}
