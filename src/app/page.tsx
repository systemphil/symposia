import ClientErrorToasts from "@/components/ClientErrorToasts";
import AuthShowcase from "../components/test/AuthShowcase";
import ToastTest from "@/components/test/ToastTest";

export default async function Home() {

    return (
        <main className="h-screen flex flex-col justify-front items-center gap-4 bg-slate-200">
            <p>Index page</p>
            {/* 
                TEST COMPONENTS
                //TODO To be removed   
            */}
            <AuthShowcase />
            <ToastTest />
            <ClientErrorToasts />
        </main>
    )
}