import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/config/stylesConfig.ts",
    ],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
        },
    },
    // variants: {
    //   extend: {
    //     transform: ['hover', 'group-hover'],
    //     translate: ['hover', 'group-hover'],
    //     textColor: ['responsive', 'hover', 'focus', 'group-hover'],
    //   }
    // },
    plugins: [require("daisyui"), require("@tailwindcss/typography")],
    daisyui: {
        logs: false,
        themes: ["light", "emerald", "pastel", "fantasy"],
    },
};
export default config;
