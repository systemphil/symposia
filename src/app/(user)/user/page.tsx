import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";


export default async function Admin() {
    const session = await getServerAuthSession();

    if (!session) {
        redirect("/");
    }

    return (
        <main className="h-screen flex flex-col justify-front items-center gap-4 bg-slate-200">
            <p>USER index page</p>
        </main>
    )
}