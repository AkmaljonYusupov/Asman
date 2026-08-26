import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import './i18n'
import App from './App'
import './styles/main.scss'

// Brauzerning o'zi scroll pozitsiyasini "eslab qolishini" o'chiramiz —
// aks holda u bizning reset urinishimiz bilan poyga (race condition)
// holatiga tushib, natijani bekor qilishi mumkin (ayniqsa orqaga/oldinga
// tugmalari bosilganda).
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
)