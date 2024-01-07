import { CourseGridCSR } from "@/components/CourseGridCSR";
import Heading from "@/components/Heading";
import { stylesConfig } from "@/config/stylesConfig";
import Link from "next/link";

export default async function AdminPage() {
    return (
        <main className={`h-screen flex flex-col justify-front items-center gap-4 ${stylesConfig.adminPage.bgColor}`}>
            <Heading>Admin</Heading>
            <Heading as='h2'>Your courses</Heading>
            <CourseGridCSR />
            <Link href="/admin/courses/new">
                <button className="btn btn-primary">Create a course</button>
            </Link>
        </main>
    )
}