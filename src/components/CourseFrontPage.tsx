import { dbGetCourseBySlug } from "@/server/controllers/dbController";
import { redirect } from "next/navigation";
import CourseEnroll from "@/components/CourseEnroll";
import Heading from "@/components/Heading";
import Image from "next/image";
import Link from "next/link";
import { ToastSearchParams } from "./ToastSearchParams";
import { TableOfLessons } from "./TableOfLessons";
import { MDXRenderer } from "./MDXRenderer";
import { cache } from "@/server/cache";

const getCourseBySlug = cache(
    async (slug) => {
        return await dbGetCourseBySlug(slug);
    },
    ["/courses"]
);

export default async function CourseFrontPage({ slug }: { slug: string }) {
    const course = await getCourseBySlug(slug);

    if (!course) {
        return redirect("/courses");
    }

    return (
        <div className="flex flex-col justify-center items-center py-10">
            <div className="flex justify-center gap-20 flex-wrap">
                <div className="flex flex-col">
                    <Link
                        href="/courses"
                        className="text-base self-start  text-primary opacity-70 transition hover:opacity-100 p-2"
                    >
                        {`<- Back to courses`}
                    </Link>
                    <div className="flex flex-col grow items-center justify-center">
                        <Heading>{course.name}</Heading>
                        <Heading as="h6">{course.description}</Heading>
                    </div>
                </div>

                {course.imageUrl && (
                    <Image
                        className="mask mask-hexagon"
                        src={course.imageUrl}
                        alt={`Course preview ${course.name}`}
                        width={340}
                        height={240}
                    />
                )}
            </div>
            <div className="flex justify-center gap-20 flex-wrap-reverse mt-10 md:mt-1">
                {course?.details?.mdxCompiled ? (
                    <MDXRenderer data={course.details.mdxCompiled} />
                ) : (
                    <div>No course details</div>
                )}

                <div className="flex flex-col justify-start items-center md:items-end md:pt-8">
                    <CourseEnroll slug={slug} />
                    <TableOfLessons
                        lessons={course.lessons}
                        courseSlug={slug}
                    />
                </div>
            </div>
            <ToastSearchParams />
        </div>
    );
}
