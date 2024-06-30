export function Header({ score, bestScore, isDialogOpen }) {
    if (!isDialogOpen) {
        return (
            <div className="header">
                <div className="logo">
                    <img width={'250px'} src="/logo.png" alt="Logo" />
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
