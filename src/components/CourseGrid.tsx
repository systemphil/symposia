import CourseCard from "./CourseCard";
import { dbGetAllPublishedCourses } from "@/server/controllers/dbController";
import Heading from "./Heading";

export default async function CourseGrid() {
    const courses = await dbGetAllPublishedCourses();

    if (courses.length === 0) {
        return (
            <Heading as="h6">
                No courses available. Please check in at a later time.
            </Heading>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-6">
            {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
            ))}
        </div>
    );
}
