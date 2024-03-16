"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, loggerLink } from "@trpc/client";
import React, { useState } from "react";
import SuperJSON from "superjson";

import { apiClientside } from "./trpcClientside";
import { getBaseUrlClientside } from "@/utils/utils";

/**
 * Provider for tRPC calls for React client-side components. Makes use of Tanstack React Query for its operation.
 * @example This should be added to the app top-level /app/layout.tsx
 */
export default function TRPCProvider({ children }: {children: React.ReactNode }) {
    const baseUrl = `${getBaseUrlClientside()}/api/trpc`;
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false
            }
        }
    }));
    const [trpcClient] = useState(() =>
        apiClientside.createClient({
            links: [
                loggerLink({
                    enabled: (opts) =>
                        process.env.NODE_ENV === "development" ||
                        (opts.direction === "down" && opts.result instanceof Error),
                }),
                httpBatchLink({
                    url: baseUrl,
                }),
            ],
            transformer: SuperJSON,
        })
    );
    return(
        <apiClientside.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </apiClientside.Provider>
    )
}