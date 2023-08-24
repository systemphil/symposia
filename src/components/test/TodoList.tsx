"use client";

import { apiClientside } from "@/lib/trpc/trpcClientside";
import { apiServerside } from "@/lib/trpc/trpcServerside";

export default function TodoList({
    initialTodos
}: {
    initialTodos: Awaited<ReturnType<(typeof apiServerside.fiction)["getTodos"]>>;
}) {
    const getTodos = apiClientside.fiction.getTodos.useQuery(undefined, {
        initialData: initialTodos,
        refetchOnMount: false,
        refetchOnReconnect: false,
    });

    return (
        <div>
            <div>{JSON.stringify(getTodos.data)}</div>
        </div>
    )
}