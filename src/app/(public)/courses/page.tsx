import CourseGrid from "@/components/CourseGrid";
import Heading from "@/components/Heading";
import { Suspense } from "react";

export default async function PublishedCourses() {

    return (
        <main className={`h-screen flex flex-col justify-front items-center gap-4`}>
            <Heading>Available Courses</Heading>

            <Suspense fallback={<p>Loading...</p>}>
                <CourseGrid/>
            </Suspense>
        </main>
    );
};
