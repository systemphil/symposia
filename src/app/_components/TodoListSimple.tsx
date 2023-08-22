"use client";

import { apiClientside } from "@/app/_lib/trpc/trpcClientside";
import { apiServerside } from "../_lib/trpc/trpcServerside";

export default function TodoList() {
    const getTodos = apiClientside.fiction.getTodos.useQuery();

    return (
        <div>
            <p>From Simple useQuery with no options</p>
            <div>{JSON.stringify(getTodos.data)}</div>
        </div>
    )
}