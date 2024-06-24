import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useEffect, useRef, useState } from 'react'

function LoadingSpinner() {
    const container = useRef()
    const tl = useRef()

    useGSAP(() => {
        tl.current = gsap
            .timeline({ repeat: -1 })
            .to('.circle-one', { y: -30, background: '#000', duration: 0.25 })
            .to('.circle-one', { y: 0, background: '#ccc', duration: 0.25 })
            .to(
                '.circle-two',
                { y: -30, background: '#000', duration: 0.25 },
                '<'
            )
            .to('.circle-two', { y: 0, background: '#ccc', duration: 0.25 })
            .to(
                '.circle-three',
                { y: -30, background: '#000', duration: 0.25 },
                '<'
            )
            .to('.circle-three', { y: 0, background: '#ccc', duration: 0.25 })
    }, [container])

    return (
        <div ref={container} className="loader-container">
            <div className="circle circle-one"></div>
            <div className="circle circle-two"></div>
            <div className="circle circle-three"></div>
        </div>
    )
}

export default function Cards({ difficulty, score, setScore }) {
    const [pokemons, setpokemons] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedPokemons, setSelectedPokemons] = useState([])
    const [isFlipping, setIsFlipping] = useState(false)
    const pokeCard = useRef(null)
    const { contextSafe } = useGSAP({ scope: pokeCard })

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
                                    let j = Math.floor(Math.random() * i + 1)
                                    let temp = cpyPokemons[i]
                                    cpyPokemons[i] = cpyPokemons[j]
                                    cpyPokemons[j] = temp
                                }
                                setpokemons([...cpyPokemons])
                                //rotate cards back
                                cards.forEach((card) => {
                                    gsap.timeline().to(card, {
                                        rotateY: '0deg',
                                        duration: 0.8,
                                        onComplete: () => setIsFlipping(false),
                                    })
                                })
                            } else {
                                //if same card is selected game over
                                //rotate cards
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
            numCards = 6
        } else if (difficulty === 'Medium') {
            numCards = 12
        } else {
            numCards = 18
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
                    setpokemons(res)
                }
            })
            .catch((err) => {
                throw new Error(err)
            })
        return () => {
            ignore = true
        }
    }, [difficulty])

    if (isLoading) {
        return <LoadingSpinner />
    } else {
        return (
            <div ref={pokeCard} className="cards">
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
                                        src={
                                            pokemon.sprites.other.dream_world
                                                .front_default
                                        }
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
        )
    }
}
