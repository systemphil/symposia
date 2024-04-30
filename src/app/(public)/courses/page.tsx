import CourseGrid from "@/components/CourseGrid";
import Heading from "@/components/Heading";
import { PageWrapper } from "@/components/PageWrapper";
import { Suspense } from "react";

export default async function PublishedCourses() {
    return (
        <PageWrapper>
            <Heading>Available Courses</Heading>

            <Suspense fallback={<p>Loading...</p>}>
                <CourseGrid />
            </Suspense>
        </PageWrapper>
    );
}
