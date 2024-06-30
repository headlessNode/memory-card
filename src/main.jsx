import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
        <video className="background-video" autoPlay muted loop>
            <source src="/background-video.mp4" type="video/mp4" />
        </video>
    </React.StrictMode>
)
