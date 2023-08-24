import { apiServerside } from "../lib/trpc/trpcServerside"
import AuthShowcase from "../components/test/AuthShowcase";
import TodoList from "../components/test/TodoList";

export default async function Home() {
    const todos = await apiServerside.fiction.getTodos();

    return (
        <main className="h-screen flex flex-col justify-front items-center gap-4 bg-slate-200">
            <p>Index page</p>
            <AuthShowcase />
            <TodoList initialTodos={todos}/>
        </main>
    )
}