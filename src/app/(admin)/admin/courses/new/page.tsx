import Heading from "@/components/Heading";
import { PageWrapper } from "@/components/PageWrapper";
import { CourseForm } from "@/components/forms/CourseForm";

export default async function NewCourse() {
    return (
        <PageWrapper>
            <Heading as="h1">New Course</Heading>
            <CourseForm />
        </PageWrapper>
    );
}
