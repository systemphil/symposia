import { ReactNode } from "react";

export function PageWrapper({ children }: { children: ReactNode }) {
    return (
        <main className="h-full min-h-screen flex flex-col justify-front items-center container">
            {children}
        </main>
    );
}
