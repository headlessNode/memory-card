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
        {
            console.log(pokemons)
        }
        return (
            <div className="cards">
                {pokemons.map((pokemon, index) => {
                    return (
                        <button
                            onClick={handleCardClick}
                            className="poke-card"
                            key={index}
                        >
                            <img
                                src={pokemon.sprites.front_default}
                                alt={pokemon.name}
                            />
                            <p>{pokemon.name}</p>
                        </button>
                    )
                })}
            </div>
        )
    }
}
