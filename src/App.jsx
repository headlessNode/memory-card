import './assets/styles/App.css'
import { useState, useEffect } from 'react'
import LoadingSpinner from './components/loadingSpinner'
import BackgroundVideo from './components/background'
import Header from './components/Header'
import MainBody from './components/Mainbody'
import Footer from './components/Footer'

function App() {
    const [score, setScore] = useState(0)
    const [bestScore, setBestScore] = useState(0)
    const [isDialogOpen, setIsDialogOpen] = useState(true)
    const [isBackgroundLoaded, setIsBackgroundLoaded] = useState(false)

    useEffect(() => {
        if (localStorage.getItem('bestScore') === null) {
            localStorage.setItem('bestScore', JSON.stringify(bestScore))
        } else {
            const prevBestScore = JSON.parse(localStorage.getItem('bestScore'))
            setBestScore(parseInt(prevBestScore))
        }
    }, [])

    function handleBackgroundLoad() {
        setIsBackgroundLoaded(true)
    }

    return (
        <div className="wrapper">
            <BackgroundVideo onLoad={handleBackgroundLoad} />
            {isBackgroundLoaded ? (
                <>
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
                </>
            ) : (
                <LoadingSpinner />
            )}
        </div>
    )
}

export default App
