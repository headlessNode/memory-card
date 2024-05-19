import './App.css'
import { useState, useEffect } from 'react'

function Header({ score, bestScore }) {
    return (
        <div className="header">
            <div className="score">
                <p>Score: {score}</p>
            </div>
            <div className="best-score">
                <p>Best Score: {bestScore}</p>
            </div>
        </div>
    )
}

function MainBody() {
    return <div className="main-body"></div>
}

function Footer() {
    return <div className="footer"></div>
}

function App() {
    const [score, setScore] = useState(0)
    const [bestScore, setBestScore] = useState(0)

    useEffect(() => {
        let controller = new AbortController()
        const signal = controller.signal
        function getCharacters() {
            const headers = {
                Accept: 'application/json',
                Authorization: 'Bearer NViWbY8d7ps9VfDbwfD4',
            }
            fetch(' https://the-one-api.dev/v2/character', {
                headers: headers,
                signal: signal,
            })
                .then((res) => {
                    console.log(res)
                })
                .catch((err) => {
                    console.log(err)
                })
        }
        getCharacters()
        return () => controller.abort()
    }, [])
    return (
        <div className="wrapper">
            <Header score={score} bestScore={bestScore} />
            <MainBody />
            <Footer />
        </div>
    )
}

export default App
