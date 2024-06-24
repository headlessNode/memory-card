import { forwardRef } from 'react'

export const GameOverDialog = forwardRef(
    (
        { isGameOver, setIsGameOver, score, setScore, isGameWon, setIsGameWon },
        ref
    ) => {
        function handlePlayAgain() {
            setIsGameOver(false)
            setScore(0)
            const dialog = ref.current
            dialog.close()
        }

        function handleQuit() {}

        if (isGameOver) {
            return (
                <div className="end-game-dialog">
                    <dialog ref={ref}>
                        <div>
                            <h1>Game Over!</h1>
                            <p>Your final score is {score}</p>
                            <ul>
                                <li>
                                    <a href="#" onClick={handlePlayAgain}>
                                        PLAY AGAIN
                                    </a>
                                </li>
                                <li>
                                    <a href="#" onClick={handleQuit}>
                                        QUIT
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </dialog>
                </div>
            )
        } else if (isGameWon) {
            return (
                <div className="end-game-dialog">
                    <dialog ref={ref}>
                        <div>
                            <h1>You Won!</h1>
                            <p>Your final score is {score}</p>
                            <ul>
                                <li>
                                    <a href="#" onClick={handlePlayAgain}>
                                        PLAY AGAIN
                                    </a>
                                </li>
                                <li>
                                    <a href="#" onClick={handleQuit}>
                                        QUIT
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </dialog>
                </div>
            )
        } else {
            return null
        }
    }
)

export default GameOverDialog
