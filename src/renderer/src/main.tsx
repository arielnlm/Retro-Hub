import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '98.css' 
import './assets/main.css' // <--- OVO JE NOVO

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)