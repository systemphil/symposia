import { DeleteEntryProvider } from "@/components/ContextDeleteEntry";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic"; // Nextjs flags that disables all caching of fetch requests and always invalidates routes on /admin/*
export const revalidate = 0;

/**
 * AdminLayout controls the access and UI for /admin/**
 */
export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerAuthSession();

    if (!session || session.user.role !== "ADMIN") {
        redirect("/?error=unauthorized");
    }

    return (
        <DeleteEntryProvider>
            <section>
                <p className="w-full bg-red-200 fixed shadow flex flex-col justify-center items-center">
                    ADMIN AREA
                </p>
                <div className="pt-12">{children}</div>
            </section>
        </DeleteEntryProvider>
    );
}
