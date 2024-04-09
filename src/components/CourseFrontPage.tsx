import { dbGetCourseBySlug } from "@/server/controllers/dbController";
import { redirect } from "next/navigation";
import CourseEnrollButton from "@/components/CourseEnrollButton";
import Heading from "@/components/Heading";
import Image from "next/image";
import Link from "next/link";
import { Toasty } from "./Toasty";
import { CourseLessonContents } from "./CourseLessonContents";

export default async function CourseFrontPage ({ slug }: { slug: string}) {
    const course = await dbGetCourseBySlug(slug);

    if (!course) {
        return redirect("/courses");
    }

    console.log(course.lessons.map(lesson => lesson.slug))

    return (
        <div className="flex flex-col justify-center items-center">
            <Link href="/courses" className="group text-base text-primary opacity-80 transition hover:opacity-100 p-2">
                {/* // TODO this arrow animation is not working  */}
                <span className="relative pr-2 transition group-hover:-translate-x-1">←</span>
                <span>Back to courses</span>
            </Link>
            {course.imageUrl && (
                <Image
                    src={course.imageUrl}
                    alt={`Course preview ${course.name}`}
                    width={340}
                    height={240}
                />
            )}
            <Heading>{course.name}</Heading>
            <Heading as='h6'>{course.description}</Heading>
            <CourseEnrollButton slug={slug}/>
            <CourseLessonContents lessons={course.lessons} courseSlug={slug} />
            <Toasty />
        </div>
    );
}