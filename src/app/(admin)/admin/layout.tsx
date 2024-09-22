import { DeleteEntryProvider } from "@/components/ContextDeleteEntry";
import { getServerAuthSession } from "@/server/auth";
import Link from "next/link";
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
                <div className="w-full bg-purple-200 z-40 fixed shadow flex justify-center items-center py-1 gap-3">
                    <span className="text-purple-300">ADMIN AREA</span>
                    <AdminBtn href="/admin">Main</AdminBtn>
                    <AdminBtn href="/admin/mng">Management</AdminBtn>
                    <span className="text-purple-300">ADMIN AREA</span>
                </div>
                <div className="pt-12">{children}</div>
            </section>
        </DeleteEntryProvider>
    );
}

function AdminBtn(props: { href: string; children: React.ReactNode }) {
    return (
        <Link href={props.href}>
            <button className="btn btn-primary btn-outline btn-sm">
                {props.children}
            </button>
        </Link>
    );
}
