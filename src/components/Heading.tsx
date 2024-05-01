import { cinzel } from "@/utils/fonts";

type HeadingProps = {
    children: React.ReactNode;
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    classes?: string;
};

const Heading = ({ children, as = "h1", classes }: HeadingProps) => {
    const baseClasses = `${
        cinzel.variable
    } font-serif z-10 font-extrabold leading-tight text-center pb-4 bg-clip-text ${
        !classes &&
        "text-transparent bg-gradient-to-b from-black/80 to-black dark:from-white dark:to-[#AAAAAA]"
    }`;
    switch (as) {
        case "h1":
            return (
                <h1
                    className={`${baseClasses} ${classes} text-4xl md:text-5xl lg:text-6xl`}
                >
                    {children}
                </h1>
            );
        case "h2":
            return (
                <h2
                    className={`${baseClasses} ${classes} text-3xl md:text-4xl lg:text-5xl`}
                >
                    {children}
                </h2>
            );
        case "h3":
            return (
                <h3
                    className={`${baseClasses} ${classes} text-2xl md:text-3xl lg:text-4xl`}
                >
                    {children}
                </h3>
            );
        case "h4":
            return (
                <h4
                    className={`${baseClasses} ${classes} text-xl md:text-2xl lg:text-3xl`}
                >
                    {children}
                </h4>
            );
        case "h5":
            return (
                <h5
                    className={`${baseClasses} ${classes} text-lg md:text-xl lg:text-2xl`}
                >
                    {children}
                </h5>
            );
        case "h6":
            return (
                <h6
                    className={`${baseClasses} ${classes} text-md md:text-lg lg:text-xl`}
                >
                    {children}
                </h6>
            );
    }
};

export default Heading;
