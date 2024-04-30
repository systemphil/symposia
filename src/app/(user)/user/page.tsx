import { PageWrapper } from "@/components/PageWrapper";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function Admin() {
    const session = await getServerAuthSession();

    if (!session) {
        redirect("/");
    }

    return (
        <PageWrapper>
            <p>USER index page</p>
        </PageWrapper>
    );
}
