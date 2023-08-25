import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
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
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    require("daisyui"),
  ],
  daisyui: {
    logs: false,
    themes: [
      "light",
      // {
      //   exampleRokni: {
      //     "primary": "#febe6b",
      //     "secondary": "#ffc9a7",
      //     "accent": "#f68961",
      //     "neutral": "#efefe9",
      //     "base-100": "#ffffff",
      //   }
      // }
    ],
  },
}
export default config
