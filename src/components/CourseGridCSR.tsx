"use client";

import CourseCard from "./CourseCard";
import { apiClientside } from "@/lib/trpc/trpcClientside";
import LoadingBars from "./LoadingBars";
import Heading from "./Heading";

/**
 * Clientside rendered course grid. Only used on admin page, so it activates admin mode on course cards.
 */
export const CourseGridCSR = () => {
    const { data: courses, isLoading } = apiClientside.db.getAllCourses.useQuery();
    const isAdmin = true;

    if (isLoading) {
        return <LoadingBars />;
    }

    return (
        <>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-6'>
                {courses && courses.map(course => (
                    <CourseCard key={course.id} course={course} isAdmin={isAdmin} />
                ))}
            </div>

            {( !courses || courses.length === 0 ) &&                 
            <div className="flex justify-center">
                <Heading as='h3'>You don&apos;t have any courses yet. Click below to make one!</Heading>
            </div>}
        </>
    );
};
