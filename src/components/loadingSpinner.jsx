import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef } from 'react'

export function LoadingSpinner() {
    const container = useRef()
    const tl = useRef()

    useGSAP(() => {
        tl.current = gsap
            .timeline({ repeat: -1 })
            .to('.pokeball', {
                x: -10,
                rotate: -20,
                duration: 0.3,
                ease: 'none',
            })
            .to('.pokeball', {
                x: 10,
                rotate: 20,
                duration: 0.2,
                ease: 'none',
            })
            .to('.pokeball', { y: -40, duration: 0.3, ease: 'none' }) // Jump up
            .to('.pokeball', { y: 0, duration: 0.3, ease: 'none' }) // Fall down
            .to('.pokeball', {
                x: -10,
                rotate: -10,
                duration: 0.3,
                ease: 'none',
            })
            .to('.pokeball', {
                x: 10,
                rotate: 10,
                duration: 0.2,
                ease: 'none',
            })
    }, [container])

    return (
        <div ref={container} className="loader-container">
            <div className="pokeball"></div>
        </div>
    )
}

export default LoadingSpinner
