import CourseGrid from "@/components/CourseGrid";
import Heading from "@/components/Heading";
import { stylesConfig } from "@/config/stylesConfig";
import { dbGetAllCourses } from "@/server/controllers/coursesController";
import Link from "next/link";

export default async function Admin() {
    const courses = await dbGetAllCourses();

    return (
        <main className={`h-screen flex flex-col justify-front items-center gap-4 ${stylesConfig.adminPage.bgColor}`}>
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
                <button className="btn btn-primary">Create a course</button>
            </Link>
        </main>
    )
}