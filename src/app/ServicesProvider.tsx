import type { ReactNode } from 'react'
import type { Services } from './createServices'
import { ServicesContext } from './servicesContext'

interface ServicesProviderProps {
  services: Services
  children: ReactNode
}

export function ServicesProvider({ services, children }: ServicesProviderProps) {
  return <ServicesContext value={services}>{children}</ServicesContext>
}
