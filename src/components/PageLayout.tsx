import type { ReactNode } from 'react'

interface PageLayoutProps {
  headerExtras?: ReactNode
  children: ReactNode
}

export function PageLayout({ headerExtras, children }: PageLayoutProps) {
  return (
    <main className="container">
      <header className="page-header">
        <h1>Guestbook</h1>
        <p className="tagline">Leave a message for everyone!</p>
        {headerExtras}
      </header>
      {children}
    </main>
  )
}
