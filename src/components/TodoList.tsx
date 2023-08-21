"use client";

import { trpc } from "@/lib/trpc/client";

export default function TodoList() {
    const getTodos = trpc.fiction.getTodos.useQuery();

    return (
        <div>
            <div>{JSON.stringify(getTodos.data)}</div>
        </div>
    )
}