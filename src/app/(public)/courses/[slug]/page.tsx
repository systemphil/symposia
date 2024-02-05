import CourseEnrollButton from "@/components/CourseEnrollButton";
import Heading from "@/components/Heading";
import { stylesConfig } from "@/config/stylesConfig";
import { dbGetCourseBySlug } from "@/server/controllers/dbController";
import { redirect } from "next/navigation";

export default async function CourseFrontPage ({ params }: { params: { slug: string }}) {
    const slug = params.slug;
    if (typeof slug !== "string") {
        throw new Error("missing course slug");
    }

    const course = await dbGetCourseBySlug(slug);

    if (!course) {
        console.log("No course found");
        redirect("/courses");
    }

    return (
        <main className={`h-screen flex flex-col justify-front items-center gap-4 ${stylesConfig.coursesPage.bgColor}`}>
            <Heading>{course.name}</Heading>
            <Heading as='h6'>{course.description}</Heading>
            <CourseEnrollButton slug={slug}/>
        </main>
    )
}