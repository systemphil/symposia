import CourseCard from "./CourseCard";
import { dbGetAllPublishedCourses } from "@/server/controllers/dbController";

export default async function CourseGrid () {
    const courses = await dbGetAllPublishedCourses();

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-6'>
            {courses.map(course => (
                <CourseCard key={course.id} course={course} />
            ))}
        </div>
    );
};
