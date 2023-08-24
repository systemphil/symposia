import CourseGrid from "@/components/CourseGrid";
import Heading from "@/components/Heading";
import { dbGetAllCourses } from "@/server/controllers/courses";
import Link from "next/link";

export default async function Admin() {
    const courses = await dbGetAllCourses();

    return (
        <main className="h-screen flex flex-col justify-front items-center gap-4 bg-slate-200">
            <Heading>Admin</Heading>
            <Heading as='h2'>Your courses</Heading>

            {(
                courses.length > 0 
            ) ? (
                <CourseGrid courses={courses} isAdmin />
            ) : (
                <div>
                    <Heading as='h3'>You don&apos;t have any courses yet.</Heading>
                </div>
            )}

            <Link href="/admin/courses/new">
                <button>Create a course</button>
            </Link>
        </main>
    )
}