import TodoList from "@/app/_components/TodoList"
import { TestProcess } from "./_components/TestProcess"
import { apiServerside } from "./_lib/trpc/trpcServerside"
import TodoListSimple from "./_components/TodoListSimple";

export default async function Home() {
    const todos = await apiServerside.fiction.getTodos();

    return (
        <main className="h-screen flex flex-col justify-front items-center gap-4 bg-slate-200">
            <p>Index page</p>
            <TodoList initialTodos={todos}/>
            <TodoListSimple />
            <TestProcess />
        </main>
    )
}