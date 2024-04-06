import ClientErrorToasts from "@/components/ClientErrorToasts";

export default async function Home() {
    return (
        <main className="h-screen flex flex-col justify-front items-center gap-4 bg-slate-200">
            <p>Index page</p>
            
            <ClientErrorToasts />
        </main>
    )
}