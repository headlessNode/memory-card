import './App.css'
import { useState, useEffect, useRef } from 'react'
import Cards from './cards'

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

function MainBody({ setScore, score }) {
    const [showModal, setShowModal] = useState(true)
    const dialogRef = useRef(null)
    const [difficulty, setDifficulty] = useState('')

    function handleClick(e) {
        e.preventDefault()
        switch (e.target.textContent) {
            case 'Easy': {
                dialogRef.current.close()
                setDifficulty('Easy')
                setShowModal(false)
                break
            }
            case 'Medium': {
                dialogRef.current.close()
                setDifficulty('Medium')
                setShowModal(false)
                break
            }
            case 'Hard': {
                dialogRef.current.close()
                setDifficulty('Hard')
                setShowModal(false)
                break
            }
        }
    }

    useEffect(() => {
        const dialog = dialogRef.current
        dialog.showModal()
        return () => {
            if (dialog.open) {
                dialog.close()
            }
        }
    }, [])

    if (showModal) {
        return (
            <div className="main-body">
                <dialog ref={dialogRef}>
                    <div>
                        <h1>Select difficulty level</h1>
                        <div className="links">
                            <ul>
                                <li>
                                    <a href="#" onClick={handleClick}>
                                        Easy
                                    </a>
                                </li>
                                <li>
                                    <a href="#" onClick={handleClick}>
                                        Medium
                                    </a>
                                </li>
                                <li>
                                    <a href="#" onClick={handleClick}>
                                        Hard
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="github">
                            <a
                                href="https://github.com/headlessNode/memory-card"
                                target="_blank"
                            >
                                GITHUB
                            </a>
                        </div>
                    </div>
                </dialog>
            </div>
        )
    } else {
        return (
            <div className="main-body">
                <Cards
                    difficulty={difficulty}
                    setDifficulty={setDifficulty}
                    score={score}
                    setScore={setScore}
                />
            </div>
        )
    }
}

function Footer() {
    return <div className="footer"></div>
}

function App() {
    const [score, setScore] = useState(0)
    const [bestScore, setBestScore] = useState(0)

    return (
        <div className="wrapper">
            <Header score={score} bestScore={bestScore} />
            <MainBody score={score} setScore={setScore} />
            <Footer />
        </div>
    )
}

export default App
