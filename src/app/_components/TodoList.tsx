"use client";

import { apiClientside } from "@/app/_lib/trpc/trpcClientside";
import { apiServerside } from "../_lib/trpc/trpcServerside";

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