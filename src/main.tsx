import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app/App'
import { createServices } from './app/createServices'
import { ServicesProvider } from './app/ServicesProvider'
import { SetupRequired } from './components/SetupRequired'
import { loadConfig } from './config/appConfig'
import './styles.css'

const container = document.getElementById('root')
if (!container) throw new Error('Root element #root was not found')

const result = loadConfig()

createRoot(container).render(
  <StrictMode>
    {result.ok ? (
      <ServicesProvider services={createServices(result.config)}>
        <App />
      </ServicesProvider>
    ) : (
      <SetupRequired missingKeys={result.missingKeys} />
    )}
  </StrictMode>,
)
