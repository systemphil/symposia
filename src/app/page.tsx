import TodoList from "@/components/TodoList"

export default function Home() {
    return (
        <main className="h-screen flex flex-col justify-center items-center bg-slate-200">
            <p>Index page</p>
            <TodoList />
        </main>
    )
}