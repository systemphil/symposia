import Heading from "@/components/Heading";
import LessonForm from "@/components/forms/LessonForm";
import { stylesConfig } from "@/config/stylesConfig";

export default async function NewLesson({params}: {params: {courseId: string}}) {

    return (
        <main className={`h-screen flex flex-col justify-front items-center gap-4 ${stylesConfig.page.bgColor}`}>
            <Heading as="h1">New Course</Heading>
            <LessonForm courseId={params.courseId}/>
        </main>
    )
}