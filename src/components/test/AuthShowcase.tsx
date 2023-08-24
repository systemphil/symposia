"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { apiClientside } from "../../lib/trpc/trpcClientside";

export default function AuthShowcase() {
    const { data: session } = useSession();
    const { data: secretMessage } = apiClientside.fiction.getSecretMessage.useQuery(
        undefined, // no input
        { enabled: session?.user !== undefined }
    );
    const { data: superSecret } = apiClientside.fiction.getSuperSecretMessage.useQuery(
        undefined, // no input
        { enabled: session?.user !== undefined }
    );

    if (session) {
        return (
            <>
                {secretMessage && <span> - {secretMessage}</span>}
                {superSecret && <span> - {superSecret}</span>}
                Signed in as {session.user.email} <br />
                <button onClick={() => signOut()}>Sign out</button>
            </>
        )
    }
    return (
        <>
            Not signed in <br />
            <button onClick={() => signIn()}>Sign in</button>
        </>
    )
}