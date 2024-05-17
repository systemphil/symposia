import Heading from "@/components/Heading";
import { PageWrapper } from "@/components/PageWrapper";
import LessonForm from "@/components/forms/LessonForm";

export default async function NewLesson({
    params,
}: {
    params: { courseId: string };
}) {
    return (
        <PageWrapper>
            <Heading as="h1">New Lesson</Heading>
            <LessonForm courseId={params.courseId} />
        </PageWrapper>
    );
}
