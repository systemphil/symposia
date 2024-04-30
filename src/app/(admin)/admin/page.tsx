import { CourseGridCSR } from "@/components/CourseGridCSR";
import Heading from "@/components/Heading";
import { PageWrapper } from "@/components/PageWrapper";
import Link from "next/link";

export default async function AdminPage() {
    return (
        <PageWrapper>
            <Heading>Admin</Heading>
            <Heading as="h2">Your courses</Heading>
            <CourseGridCSR />
            <Link href="/admin/courses/new">
                <button className="btn btn-primary">Create a course</button>
            </Link>
        </PageWrapper>
    );
}
