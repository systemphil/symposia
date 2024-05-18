import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getServerAuthSession();

    if (!user) {
        return redirect("/?missing=login");
    }

    return <>{children}</>;
}
