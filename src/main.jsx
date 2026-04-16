import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

console.log("main.jsx: loading...");
const rootElement = document.getElementById('root');
console.log("main.jsx: root element:", rootElement);

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
  console.log("main.jsx: render called");
} else {
  console.error("main.jsx: root element NOT FOUND!");
}
