import { useEffect, useRef, useState } from 'react'

// easy - 5
// medium - 10
// hard - 18

export default function Cards({ difficulty }) {
    let numOfCards = useRef(0)
    let promises = useRef([])
    const [pokemons, setpokemons] = useState([])
    if (difficulty.current === 'Easy') {
        numOfCards.current = 5
    } else if (difficulty.current === 'Medium') {
        numOfCards.current = 10
    } else {
        numOfCards.current = 18
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
        if (!ignore) {
            const cardIds = new Set()
            while (cardIds.size !== numOfCards.current) {
                cardIds.add(Math.floor(Math.random() * 100) + 1)
            }
            for (let id of cardIds) {
                promises.current.push(getCharacters(id))
            }
            Promise.all(promises.current)
                .then((res) => {
                    setpokemons(res)
                })
                .catch((err) => {
                    throw new Error(err)
                })
        }
        return () => {
            ignore = true
            promises.current = []
        }
    }, [])

    return (
        <div className="cards">
            {pokemons.map((pokemon, index) => {
                return (
                    <div className="poke-card" key={index}>
                        <img
                            src={pokemon.sprites.front_default}
                            alt={pokemon.name}
                        />
                        <p>{pokemon.name}</p>
                    </div>
                )
            })}
        </div>
    )
}
