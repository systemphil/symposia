"use client";

/**
 * Presentational client video component. Returns video if URL is truthy.
 * @notice HTML video tag _must_ have a key in order for React to re-render the component when the URL changes.
 */
const VideoViewer = ({ videoUrl }: { videoUrl: string }) => {
    if (videoUrl) {
        return (
            <video key={videoUrl} controls controlsList="nodownload">
                <source src={videoUrl} type="video/mp4" />
            </video>
        )
    }
}

export default VideoViewer;