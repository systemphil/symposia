"use client";

import { trpc } from "@/app/_lib/trpc/trpcClient";

export default function TodoList() {
    const getTodos = trpc.fiction.getTodos.useQuery();

    return (
        <div>
            <div>{JSON.stringify(getTodos.data)}</div>
        </div>
    )
}