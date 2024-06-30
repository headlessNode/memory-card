export function Header({ score, bestScore, isDialogOpen }) {
    if (!isDialogOpen) {
        return (
            <div className="header">
                <div className="title">
                    <h1>PokeCard</h1>
                </div>
                <div className="scores">
                    <div className="score">
                        <p>Score: {score}</p>
                    </div>
                    <div className="best-score">
                        <p>Best Score: {bestScore}</p>
                    </div>
                </div>
            </div>
        )
    } else {
        return null
    }
}

export default Header
