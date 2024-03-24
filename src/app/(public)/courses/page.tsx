import CourseGrid from "@/components/CourseGrid";
import Heading from "@/components/Heading";
import { stylesConfig } from "@/config/stylesConfig";
import { Suspense } from "react";

export default async function PublishedCourses() {

    return (
        <main className={`h-screen flex flex-col justify-front items-center gap-4 ${stylesConfig.coursesPage.bgColor}`}>
            <Heading>Available Courses</Heading>

            <Suspense fallback={<p>Loading...</p>}>
                <CourseGrid/>
            </Suspense>
        </main>
    );
};
