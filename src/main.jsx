import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import i18n from "./translations/i18n"

const browserLang = navigator.language.slice(0,2)

const supported = ["en","hi","mr","ta","te","bn","gu","kn","pa","ml"]

if (supported.includes(browserLang)) {
  i18n.changeLanguage(browserLang)
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
