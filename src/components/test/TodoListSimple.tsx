"use client";

import { apiClientside } from "@/lib/trpc/trpcClientside";
import { apiServerside } from "@/lib/trpc/trpcServerside";

export default function TodoList() {
    const getTodos = apiClientside.fiction.getTodos.useQuery();

    return (
        <div>
            <p>From Simple useQuery with no options</p>
            <div>{JSON.stringify(getTodos.data)}</div>
        </div>
    )
}