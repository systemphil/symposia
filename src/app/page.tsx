import { apiServerside } from "./_lib/trpc/trpcServerside"
import AuthShowcase from "./_components/Test/AuthShowcase";

export default async function Home() {
    const todos = await apiServerside.fiction.getTodos();

    return (
        <main className="h-screen flex flex-col justify-front items-center gap-4 bg-slate-200">
            <p>Index page</p>
            <AuthShowcase />
        </main>
    )
}