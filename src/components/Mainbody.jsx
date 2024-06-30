import { useState, useRef, useEffect } from 'react'
import Cards from './cards'

export function MainBody({
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
        const video = document.querySelector('.background-video')
        video.play()
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
                        <img width={'100%'} src="/logo.png" alt="Logo" />
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

export default MainBody
