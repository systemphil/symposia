"use client";

import { apiClientside } from "@/lib/trpc/trpcClientside";

export const TestProcess = () => {
    const getNumber = apiClientside.fiction.getAllUsers.useQuery();
    console.log(getNumber.data);

    return(
        <>
            <p>Result of get all users</p>
            {
                getNumber.data &&
                <div>{JSON.stringify(getNumber.data.result)}</div>
            }
        </>
    )
}