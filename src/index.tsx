import ReactDOM from 'react-dom/client'
import App from './App'
import { LanguageProvider } from './contexts/LanguageContext'
import { ThemeProvider } from './contexts/ThemeContext'
import './styles/index.css'

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Could not find root element to mount to')
}

const root = ReactDOM.createRoot(rootElement)
root.render(
  <ThemeProvider>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </ThemeProvider>
)
