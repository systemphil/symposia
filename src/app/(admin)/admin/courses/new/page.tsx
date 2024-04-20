import Heading from "@/components/Heading";
import { CourseForm } from "@/components/forms/CourseForm";

export default async function NewCourse() {
    
    return (
        <main className={`min-h-screen h-full flex flex-col justify-front items-center gap-4`}>
            <Heading as="h1">New Course</Heading>
            <CourseForm />
        </main>
    )
}