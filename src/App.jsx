import './assets/styles/App.css'
import { useState, useEffect, Suspense, lazy } from 'react'
import LoadingSpinner from './components/loadingSpinner'

const BackgroundVideo = lazy(() => import('./components/background'))
const Header = lazy(() => import('./components//Header'))
const MainBody = lazy(() => import('./components//Mainbody'))
const Footer = lazy(() => import('./components//Footer'))

function App() {
    const [score, setScore] = useState(0)
    const [bestScore, setBestScore] = useState(0)
    const [isDialogOpen, setIsDialogOpen] = useState(true)

    useEffect(() => {
        if (localStorage.getItem('bestScore') === null) {
            localStorage.setItem('bestScore', JSON.stringify(bestScore))
        } else {
            const prevBestScore = JSON.parse(localStorage.getItem('bestScore'))
            setBestScore(parseInt(prevBestScore))
        }
    }, [])

    return (
        <div className="wrapper">
            <Suspense fallback={<LoadingSpinner />}>
                <BackgroundVideo />
                <Header
                    score={score}
                    bestScore={bestScore}
                    isDialogOpen={isDialogOpen}
                />
                <MainBody
                    score={score}
                    setScore={setScore}
                    setIsDialogOpen={setIsDialogOpen}
                    bestScore={bestScore}
                    setBestScore={setBestScore}
                />
                <Footer />
            </Suspense>
        </div>
    )
}

export default App
