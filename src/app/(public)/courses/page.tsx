import CourseGrid from "@/components/CourseGrid";
import Heading from "@/components/Heading";
import { LoadingBall } from "@/components/LoadingBall";
import { PageWrapper } from "@/components/PageWrapper";
import { Suspense } from "react";

export default async function PublishedCourses() {
    return (
        <PageWrapper>
            <div className="my-16">
                <Heading>Available Courses</Heading>
            </div>

            <Suspense fallback={<LoadingBall />}>
                <CourseGrid />
            </Suspense>
        </PageWrapper>
    );
}
