import { dbGetLessonAndRelationsBySlug } from "@/server/controllers/dbController";
import { redirect } from "next/navigation";
import Heading from "@/components/Heading";
import Link from "next/link";
import { ToastSearchParams } from "./ToastSearchParams";
import { MDXRenderer } from "./MDXRenderer";
import { VideoDataLoader } from "./VideoDataLoader";
import { TableOfLessons } from "./TableOfLessons";
import { cache } from "@/server/cache";

const getLessonAndRelationsBySlug = cache(
    async (slug) => {
        return await dbGetLessonAndRelationsBySlug(slug);
    },
    ["/lessons"]
);

export async function LessonFrontPage({ lessonSlug }: { lessonSlug: string }) {
    const lessonData = await getLessonAndRelationsBySlug(lessonSlug);
    if (!lessonData) return redirect("/courses");

    const md = "md:grid md:grid-cols-4 md:items-start";
    const lg = "lg:grid-cols-6";
    const xl = "gap-0";
    const xxl = "2xl:gap-8 2xl:px-20";
    return (
        <div
            className={`flex flex-col justify-center items-center gap-2 ${md} ${lg} ${xl} ${xxl}`}
        >
            <div className="min-h-[500px] max-h-[1200px] flex w-full md:col-span-3 md:order-2">
                {lessonData.video ? (
                    <VideoDataLoader videoEntry={lessonData.video} />
                ) : (
                    <div>No video content</div>
                )}
            </div>
            <div className="md:col-span-1 md:p-2 md:order-1 lg:row-span-2">
                <div className="flex flex-col justify-start">
                    <Link
                        href={`/courses/${lessonData.course.slug}`}
                        className="text-base self-center md:self-start text-primary opacity-70 transition hover:opacity-100 p-2"
                    >
                        {`<- Back to ${lessonData.course.name}`}
                    </Link>
                    <TableOfLessons
                        lessons={lessonData.course.lessons}
                        courseSlug={lessonData.course.slug}
                    />
                </div>
            </div>
            <div className="md:col-span-4 md:m-4 md:order-3 lg:col-span-2 lg:row-span-2">
                <Heading>{lessonData.name}</Heading>
                <Heading as="h6">{lessonData.description}</Heading>

                {lessonData?.content?.mdxCompiled ? (
                    <MDXRenderer data={lessonData.content.mdxCompiled} />
                ) : (
                    <div>No lesson content</div>
                )}
            </div>
            <div className="md:col-span-4 md:m-4 md:order-4 lg:col-start-2 lg:col-span-3">
                {lessonData?.transcript?.mdxCompiled ? (
                    <MDXRenderer data={lessonData.transcript.mdxCompiled} />
                ) : (
                    <div>No transcript</div>
                )}
            </div>
            <ToastSearchParams />
        </div>
    );
}
