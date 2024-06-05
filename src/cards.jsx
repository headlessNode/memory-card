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

export default function Cards({ difficulty }) {
    const [pokemons, setpokemons] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedPokemons, setSelectedPokemons] = useState([])
    const pokeCard = useRef(null)
    const { contextSafe } = useGSAP({ scope: pokeCard })

    function handleCardClick(e) {
        let arrCpy = [...selectedPokemons]
        let pokemonSelected = e.currentTarget.textContent

        if (arrCpy.length === 0) {
            arrCpy.push(pokemonSelected)
            setSelectedPokemons([...arrCpy])
        } else {
            if (!arrCpy.includes(pokemonSelected)) {
                arrCpy.push(pokemonSelected)
                setSelectedPokemons([...arrCpy])
            } else {
                console.log('already selected')
            }
        }
    }

    const handleMouseMove = contextSafe((e) => {
        const card = e.currentTarget
        const cardRect = card.getBoundingClientRect()

        const mouseX = e.clientX - cardRect.left
        const mouseY = e.clientY - cardRect.top

        const xPercentGlare =
            Math.min(Math.max(mouseX / card.offsetWidth, 0), 1) * 100
        const yPercentGlare =
            Math.min(Math.max(mouseY / card.offsetHeight, 0), 1) * 100

        const cardHorizontalCenter = card.offsetWidth / 2
        const cardVerticalCenter = card.offsetHeight / 2

        const rotateX = (cardVerticalCenter - mouseY) / 5
        const rotateY = (mouseX - cardHorizontalCenter) / 5

        const distanceFromCenter = Math.sqrt(
            Math.pow(mouseX - cardHorizontalCenter, 2) +
                Math.pow(mouseY - cardVerticalCenter, 2)
        )
        const maxDistance = Math.sqrt(
            Math.pow(cardHorizontalCenter, 2) + Math.pow(cardVerticalCenter, 2)
        )
        const opacity = distanceFromCenter / maxDistance

        const glareAngle =
            Math.atan2(
                mouseX - cardHorizontalCenter,
                mouseY - cardVerticalCenter
            ) *
            (180 / Math.PI)

        const cardContent = [...e.currentTarget.children]

        gsap.timeline()
            .to(e.currentTarget, {
                rotateX: `${rotateX}deg`,
                rotateY: `${rotateY}deg`,
            })
            .to(
                cardContent,
                {
                    translateZ: '15px',
                },
                '<'
            )
            .to(
                e.currentTarget.lastElementChild.firstElementChild,
                {
                    rotate: `${-glareAngle}deg`,
                    opacity: opacity,
                },
                '<'
            )
    })

    const handleMouseLeave = contextSafe((e) => {
        const cardContent = [...e.currentTarget.children]
        gsap.timeline()
            .to(e.currentTarget, {
                rotateX: '0deg',
                rotateY: '0deg',
            })
            .to(
                cardContent,
                {
                    translateZ: '0px',
                },
                '<'
            )
            .to(
                e.currentTarget.lastElementChild.firstElementChild,
                {
                    opacity: 0,
                },
                '<'
            )
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
                            <img
                                src={pokemon.sprites.front_default}
                                alt={pokemon.name}
                            />
                            <p>{pokemon.name}</p>
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
