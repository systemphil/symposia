/**
 * Particular TailwindCSS configurations for reusable components (e.g. Admin pages). Import where needed.
 * For truly universal configurations when it comes to style, see `tailwind.config.ts` root project directory.
 */
export const stylesConfig = {
    adminPage: {
        bgColor: "bg-slate-200"
    },
    coursesPage: {
        bgColor: "bg-slate-200",
    },
    nav: {
        bgColor: "bg-blue-300",
        textColor: "text-slate-700"
    },
    page: {
        bgColor: "bg-slate-300",
    }
}