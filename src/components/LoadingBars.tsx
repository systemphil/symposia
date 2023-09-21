import cn from "classnames";


type LoadingBarsProps = {
    size?: "xs" | "sm" | "md" | "lg"
}
/**
 * Purely presentational UI component that shows DaisyUI loading bars centered in its scope.
 * Can optionally control the size of the loading bars by passing "xs", "sm", "md" or "lg" as props.
 * Defaults to "lg" (large) if no props are passed.
 */
const LoadingBars = ({size = "lg"}: LoadingBarsProps)  => {
    const loadingBarClasses = cn("loading loading-bars", {
        "loading-xs": size === "xs",
        "loading-sm": size === "sm",
        "loading-md": size === "md",
        "loading-lg": size === "lg",
    });

    return (
        <div className="w-full h-full flex flex-col justify-center items-center">
            <span className={loadingBarClasses}></span>
        </div>
    )
}
export default LoadingBars;