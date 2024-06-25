import { forwardRef } from 'react'

export const GameOverDialog = forwardRef(
    (
        {
            isGameOver,
            setIsGameOver,
            score,
            setScore,
            isGameWon,
            setIsGameWon,
            difficulty,
            setDifficulty,
            setIsLoading,
            setSelectedPokemons,
            setIsFlipping,
            setPokemons,
            gameReInit,
            setGameReInit,
        },
        ref
    ) => {
        //On keep playing, start the next difficulty cards
        //On keep playing at max difficulty, shuffle at same difficulty

        function handleKeepPlaying() {
            //show loading animation
            //remove current cards
            //show new set of cards
            if (difficulty == 'Medium') {
                setDifficulty('Hard')
            }
            if (difficulty == 'Easy') {
                setDifficulty('Medium')
            }
            if (difficulty == 'Hard') {
                if (gameReInit) {
                    setGameReInit(false)
                } else {
                    setGameReInit(true)
                }
            }
            setIsGameWon(false)
            setIsLoading(true)
            setSelectedPokemons([])
            setPokemons([])
            setIsFlipping(false)
            setScore(0)
            const dialog = ref.current
            dialog.close()
        }

        function handlePlayAgain() {
            if (isGameOver) {
                setIsGameOver(false)
            }
            if (isGameWon) {
                setIsGameWon(false)
            }
            if (gameReInit) {
                setGameReInit(false)
            }
            if (!gameReInit) {
                setGameReInit(true)
            }
            setIsLoading(true)
            setSelectedPokemons([])
            setPokemons([])
            setIsFlipping(false)
            setScore(0)
            const dialog = ref.current
            dialog.close()
        }

        function handleQuit() {
            //maybe rickRoll??
        }

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
                                    <a href="#" onClick={handleKeepPlaying}>
                                        KEEP PLAYING
                                    </a>
                                </li>
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
