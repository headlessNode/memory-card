import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useEffect, useRef, useState } from 'react'
import { LoadingSpinner } from './loadingSpinner'
import { GameOverDialog } from './gameOver'

export function Cards({
    difficulty,
    score,
    setScore,
    setDifficulty,
    bestScore,
    setBestScore,
}) {
    const [pokemons, setPokemons] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedPokemons, setSelectedPokemons] = useState([])
    const [isFlipping, setIsFlipping] = useState(false)
    const [isGameOver, setIsGameOver] = useState(false)
    const [isGameWon, setIsGameWon] = useState(false)
    const [gameReInit, setGameReInit] = useState(false)
    const cardsContainer = useRef(null)
    const endDialog = useRef(null)
    const { contextSafe } = useGSAP({ scope: cardsContainer })

    const handleCardClick = contextSafe((e) => {
        if (isFlipping) {
            return
        }
        //cards flipping animation
        let currentSelectedPokemon = e.currentTarget.textContent
        const cards = document.querySelectorAll('.poke-card')
        setIsFlipping(true)

        cards.forEach((card) => {
            gsap.timeline()
                .to(card, {
                    rotateX: '0deg',
                    rotateY: '0deg',
                })
                .to(
                    card,
                    {
                        rotateY: '180deg',
                        duration: 0.5,
                        onComplete: () => {
                            //game scoring logic
                            let arrCpy = [...selectedPokemons]

                            if (!arrCpy.includes(currentSelectedPokemon)) {
                                arrCpy.push(currentSelectedPokemon)
                                setSelectedPokemons([...arrCpy])
                                //update score - give one point
                                let currentScore = score
                                currentScore += 1
                                setScore(currentScore)
                                //check if score is equal to number of cards
                                if (arrCpy.length == pokemons.length) {
                                    //game won
                                    setIsGameWon(true)
                                } else {
                                    //shuffle the cards
                                    let cpyPokemons = [...pokemons]
                                    //fisher-yates algorithm
                                    //we start from the end to guarantee equal swap chance for last elements
                                    for (
                                        let i = cpyPokemons.length - 1;
                                        i > 0;
                                        i--
                                    ) {
                                        // i inclusive, j exclusive
                                        let j = Math.floor(
                                            Math.random() * i + 1
                                        )
                                        let temp = cpyPokemons[i]
                                        cpyPokemons[i] = cpyPokemons[j]
                                        cpyPokemons[j] = temp
                                    }
                                    setPokemons([...cpyPokemons])
                                    //rotate cards back
                                    cards.forEach((card) => {
                                        gsap.timeline().to(card, {
                                            rotateY: '0deg',
                                            duration: 1,
                                            onComplete: () =>
                                                setIsFlipping(false),
                                        })
                                    })
                                }
                            } else if (
                                arrCpy.includes(currentSelectedPokemon)
                            ) {
                                //if card was already selected
                                //game over dialog
                                setIsGameOver(true)
                            }
                        },
                    },
                    '-=0.1'
                )
        })
    })

    const handleMouseMove = contextSafe((e) => {
        //if cards are flipping this animation wont work
        if (isFlipping) {
            return
        }
        const card = e.currentTarget
        const cardRect = card.getBoundingClientRect()

        //position of mouse inside the card
        const mouseX = e.clientX - cardRect.left
        const mouseY = e.clientY - cardRect.top
        //center of the card
        const cardHorizontalCenter = card.offsetWidth / 2
        const cardVerticalCenter = card.offsetHeight / 2
        //how far is the mouse from the middle
        const rotateX = (cardVerticalCenter - mouseY) / 5
        const rotateY = (mouseX - cardHorizontalCenter) / 5

        const dX = mouseX - cardHorizontalCenter
        const dY = mouseY - cardVerticalCenter

        const glareAngle = -(Math.atan2(dX, dY) * 180) / Math.PI

        const distanceFromCenter = Math.sqrt(
            Math.pow(mouseX - cardHorizontalCenter, 2) +
                Math.pow(mouseY - cardVerticalCenter, 2)
        )
        const maxDistance = Math.sqrt(
            Math.pow(cardHorizontalCenter, 2) + Math.pow(cardVerticalCenter, 2)
        )
        const opacity = distanceFromCenter / maxDistance

        const glareElement = e.currentTarget.lastElementChild.firstElementChild

        gsap.timeline()
            .to(e.currentTarget, {
                rotateX: `${rotateX}deg`,
                rotateY: `${rotateY}deg`,
            })
            .to(
                glareElement,
                {
                    opacity: opacity,
                },
                '<'
            )

        glareElement.style.transform = `rotate(${glareAngle}deg)`
    })

    const handleMouseLeave = contextSafe((e) => {
        //if cards are flipping this animation wont work
        if (isFlipping) {
            return
        }
        const glareElement = e.currentTarget.lastElementChild.firstElementChild
        gsap.timeline()
            .to(e.currentTarget, {
                rotateX: '0deg',
                rotateY: '0deg',
            })
            .to(
                glareElement,
                {
                    opacity: 0,
                },
                '<'
            )

        glareElement.style.transform = 'rotate(0deg)'
    })

    useEffect(() => {
        let ignore = false
        function getCharacters(id) {
            return fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(
                (res) => {
                    if (!res.ok) {
                        throw new Error(`${res.status} ${res.statusText}`)
                    } else {
                        return res.json()
                    }
                }
            )
        }
        let promises = []
        const cardIds = new Set()
        let numCards = 0
        if (difficulty === 'Easy') {
            numCards = 5
        } else if (difficulty === 'Medium') {
            numCards = 10
        } else {
            numCards = 15
        }
        while (cardIds.size !== numCards) {
            cardIds.add(Math.floor(Math.random() * 100) + 1)
        }
        for (let id of cardIds) {
            promises.push(getCharacters(id))
        }
        Promise.all(promises)
            .then((res) => {
                if (!ignore) {
                    setIsLoading(false)
                    setPokemons(res)
                }
            })
            .catch((err) => {
                throw new Error(err)
            })
        return () => {
            ignore = true
        }
    }, [difficulty, gameReInit])
    // handle end of the game
    const handleEndGame = contextSafe((e) => {
        endDialog.current.showModal()
        const prevBestScore = JSON.parse(localStorage.getItem('bestScore'))
        if (score > parseInt(prevBestScore)) {
            setBestScore(score)
            localStorage.setItem('bestScore', JSON.stringify(score))
        }
    })

    // Effect for Game Over and Game Win
    useEffect(() => {
        if (isGameOver || isGameWon) {
            handleEndGame()
        }
        return () => {
            if (endDialog.current) {
                endDialog.current.close()
            }
        }
    }, [isGameOver, isGameWon])

    if (isLoading) {
        return <LoadingSpinner />
    } else {
        return (
            <div className="cards-container">
                <div ref={cardsContainer} className="cards">
                    {pokemons.map((pokemon, index) => {
                        return (
                            <button
                                onClick={handleCardClick}
                                className="poke-card"
                                key={index}
                                onMouseMove={handleMouseMove}
                                onMouseLeave={handleMouseLeave}
                            >
                                <div className="card-inner">
                                    <div className="front">
                                        <img
                                            src={pokemon.sprites.front_default}
                                            alt={pokemon.name}
                                        />
                                        <p>{pokemon.name}</p>
                                    </div>
                                    <div className="back">
                                        <img
                                            src="/card-back.png"
                                            alt="Pokemon card back"
                                        />
                                    </div>
                                </div>
                                <div className="glare-wrapper">
                                    <div className="glare"></div>
                                </div>
                            </button>
                        )
                    })}
                </div>
                <GameOverDialog
                    ref={endDialog}
                    isGameOver={isGameOver}
                    setIsGameOver={setIsGameOver}
                    isGameWon={isGameWon}
                    setIsGameWon={setIsGameWon}
                    score={score}
                    setScore={setScore}
                    difficulty={difficulty}
                    setDifficulty={setDifficulty}
                    setIsLoading={setIsLoading}
                    setIsFlipping={setIsFlipping}
                    setSelectedPokemons={setSelectedPokemons}
                    setPokemons={setPokemons}
                    gameReInit={gameReInit}
                    setGameReInit={setGameReInit}
                />
            </div>
        )
    }
}

export default Cards
