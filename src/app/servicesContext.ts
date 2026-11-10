import { createContext, use } from 'react'
import type { Services } from './createServices'

export const ServicesContext = createContext<Services | null>(null)

export function useServices(): Services {
  const services = use(ServicesContext)
  if (!services) throw new Error('useServices must be used within a ServicesProvider')
  return services
}
