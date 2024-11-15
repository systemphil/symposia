import Heading from "@/components/Heading";
import { Management } from "@/components/Management";
import { PageWrapper } from "@/components/PageWrapper";

export default async function ManagementPage() {
    return (
        <PageWrapper>
            <Heading as="h2">Management</Heading>
            <Management />
        </PageWrapper>
    );
}
