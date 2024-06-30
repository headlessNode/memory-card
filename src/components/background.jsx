import React, { useEffect } from 'react'

const BackgroundVideo = ({ onLoad }) => {
    useEffect(() => {
        const video = document.querySelector('.background-video')
        video.addEventListener('loadeddata', onLoad)
        return () => {
            video.removeEventListener('loadeddata', onLoad)
        }
    }, [onLoad])

    return (
        <video className="background-video" loop>
            <source src="/background-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
        </video>
    )
}

export default BackgroundVideo
