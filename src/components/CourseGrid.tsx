import type { Course } from "@prisma/client"
import CourseCard from "./CourseCard";

type CourseGridProps = {
    isAdmin?: boolean;
    courses: Course[];
}

const CourseGrid = ({ courses, isAdmin = false }: CourseGridProps) => {
    return (
        <>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {courses.map(course => (
                    <CourseCard key={course.id} course={course} isAdmin={isAdmin} />
                ))}
            </div>
        </>
    );
};

export default CourseGrid;