import CourseGrid from "@/components/CourseGrid";
import Heading from "@/components/Heading";
import { stylesConfig } from "@/config/stylesConfig";
import { dbGetAllPublishedCourses } from "@/server/controllers/dbController";


export default async function PublicCourses() {
    const courses = await dbGetAllPublishedCourses();

    return (
        <main className={`h-screen flex flex-col justify-front items-center gap-4 ${stylesConfig.coursesPage.bgColor}`}>
            <Heading>Available Courses</Heading>

            {(
                courses.length > 0
            ) ? (
                <CourseGrid courses={courses} isAdmin={false} />
            ) : (
                <div>
                    <Heading as='h3'>There are no courses currently available</Heading>
                </div>
            )}

        </main>
    )
}