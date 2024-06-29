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

        if (isGameOver) {
            return (
                <div>
                    <dialog className="end-game-dialog" ref={ref}>
                        <h1>Game Over!</h1>
                        <p>Your final score is {score}</p>
                        <button onClick={handlePlayAgain}>Play Again</button>
                    </dialog>
                </div>
            )
        } else if (isGameWon) {
            return (
                <div>
                    <dialog className="end-game-dialog" ref={ref}>
                        <h1>You Won!</h1>
                        <p>Your final score is {score}</p>
                        <h1>Game Over!</h1>
                        <p>Your final score is {score}</p>
                        <button onClick={handlePlayAgain}>PLAY AGAIN</button>
                        <button onClick={handleKeepPlaying}>
                            Keep Playing
                        </button>
                    </dialog>
                </div>
            )
        } else {
            return null
        }
    }
)

export default GameOverDialog
