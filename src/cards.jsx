import { useEffect } from 'react'

// easy - 5
// medium - 10
// hard - 18

export default function Cards({ difficulty }) {
    useEffect(() => {
        let ignore = false
        function getCharacters() {
            fetch('https://pokeapi.co/api/v2/pokemon?limit=100&offset=0')
                .then((res) => res.json())
                .then((res) => {
                    if (!ignore) {
                        const pokemon = res
                        console.log(pokemon)
                    }
                })
        }
        getCharacters()
        return () => (ignore = true)
    }, [])

    return <div className="cards"></div>
}
