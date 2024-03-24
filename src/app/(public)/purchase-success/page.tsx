import Heading from "@/components/Heading";
import { stylesConfig } from "@/config/stylesConfig";

export default async function PublishedCourses() {

    return (
        <main className={`h-screen flex flex-col justify-front items-center gap-4 ${stylesConfig.coursesPage.bgColor}`}>
            <Heading>Available Courses</Heading>

            <p>Thank you for your purchase!</p>
        </main>
    );
};