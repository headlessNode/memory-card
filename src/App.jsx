import './App.css'
import { useState, useEffect, useRef } from 'react'
import Cards from './cards'

function Header({ score, bestScore, isDialogOpen }) {
    if (!isDialogOpen) {
        return (
            <div className="header">
                <div className="title">
                    <h1>PokeCard</h1>
                </div>
                <div className="scores">
                    <div className="score">
                        <p>Score: {score}</p>
                    </div>
                    <div className="best-score">
                        <p>Best Score: {bestScore}</p>
                    </div>
                </div>
            </div>
        )
    } else {
        return null
    }
}

function Footer() {
    return (
        <div className="footer">
            <a
                href="https://www.github.com/headlessNode/memory-card"
                target="_blank"
            >
                <i className="fa-brands fa-github fa-xl"></i>
            </a>
        </div>
    )
}

function MainBody({
    setScore,
    score,
    setIsDialogOpen,
    bestScore,
    setBestScore,
}) {
    const [showModal, setShowModal] = useState(true)
    const dialogRef = useRef(null)
    const [difficulty, setDifficulty] = useState('')

    function handleClick(e) {
        e.preventDefault()
        setIsDialogOpen(false)
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
                <dialog className="start-dialog" ref={dialogRef}>
                    <div className="headline">
                        <h1>PokeCard</h1>
                        <p>A Memory Card Game</p>
                    </div>
                    <div className="links">
                        <button className="easy" onClick={handleClick}>
                            Easy
                        </button>
                        <button className="medium" onClick={handleClick}>
                            Medium
                        </button>
                        <button className="hard" onClick={handleClick}>
                            Hard
                        </button>
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
                    bestScore={bestScore}
                    setBestScore={setBestScore}
                />
            </div>
        )
    }
}

function App() {
    const [score, setScore] = useState(0)
    const [bestScore, setBestScore] = useState(0)
    const [isDialogOpen, setIsDialogOpen] = useState(true)

    useEffect(() => {
        if (localStorage.getItem('bestScore') === null) {
            localStorage.setItem('bestScore', JSON.stringify(bestScore))
        } else {
            const prevBestScore = JSON.parse(localStorage.getItem('bestScore'))
            setBestScore(parseInt(prevBestScore))
        }
    }, [])

    return (
        <div className="wrapper">
            <Header
                score={score}
                bestScore={bestScore}
                isDialogOpen={isDialogOpen}
            />
            <MainBody
                score={score}
                setScore={setScore}
                setIsDialogOpen={setIsDialogOpen}
                bestScore={bestScore}
                setBestScore={setBestScore}
            />
            <Footer />
        </div>
    )
}

export default App
