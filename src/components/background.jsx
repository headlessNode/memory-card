export const BackgroundVideo = () => {
    return (
        <div>
            <video loop className="background-video">
                <source src="/background-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    )
}

export default BackgroundVideo
