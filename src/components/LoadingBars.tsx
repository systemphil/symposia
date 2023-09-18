/**
 * Purely presentational UI component that shows DaisyUI loading bars centered in its scope.
 */
const LoadingBars = () => {
    return (
        <div className="w-full h-full flex flex-col justify-center items-center">
            <span className="loading loading-bars loading-lg"></span>
        </div>
    )
}
export default LoadingBars;