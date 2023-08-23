import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";


export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getServerAuthSession();

    if (!session || session.user.role !== "ADMIN") {
        redirect("/");
    }

    return (
        <section>
            <p className="w-full bg-red-200 flex flex-col justify-center items-center">ADMIN Navbar Placeholder</p>
            {children}
        </section>
    )
}