import AdminCourseFormContainer from "@/components/AdminCourseFormContainer";
import Heading from "@/components/Heading";
import { stylesConfig } from "@/config/stylesConfig";

export default async function NewCourse() {
    
    return (
        <main className={`h-screen flex flex-col justify-front items-center gap-4 ${stylesConfig.page.bgColor}`}>
            <Heading as="h1">New Course</Heading>
            <AdminCourseFormContainer />
        </main>
    )
}