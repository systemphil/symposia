import Heading from "@/components/Heading";
import { CourseForm } from "@/components/forms/CourseForm";
import { stylesConfig } from "@/config/stylesConfig";

export default async function NewCourse() {
    
    return (
        <main className={`min-h-screen h-full flex flex-col justify-front items-center gap-4 ${stylesConfig.page.bgColor}`}>
            <Heading as="h1">New Course</Heading>
            <CourseForm />
        </main>
    )
}