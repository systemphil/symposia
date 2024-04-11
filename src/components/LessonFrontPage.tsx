import { dbGetLessonAndRelationsBySlug } from "@/server/controllers/dbController";
import { redirect } from "next/navigation";
import Heading from "@/components/Heading";
import Link from "next/link";
import { ToastSearchParams } from "./ToastSearchParams";
import { MDXRenderer } from "./MDXRenderer";
import { VideoDisplay } from "./VideoDisplay";

export default async function LessonFrontPage ({ 
    lessonSlug 
}: { 
    lessonSlug: string 
}) {
    const lessonData = await dbGetLessonAndRelationsBySlug(lessonSlug);
    if (!lessonData) return redirect("/courses");

    return (
        <div className="flex flex-col justify-center items-center">
            <Link href={`/courses/${lessonData.course.slug}`} className="group text-base text-primary opacity-80 transition hover:opacity-100 p-2">
                <span className="relative pr-2 transition group-hover:-translate-x-1">←</span>
                <span>Back to {lessonData.course.name}</span>
            </Link>
            {
                // TODO build a course lesson menu
            }
            <div className="h-[500px] flex max-w-lg m-4">
            {
                lessonData.video
                
                ? <VideoDisplay videoEntry={lessonData.video} />
                : <div>No video content</div>
            }
            </div>
            
            <Heading>{lessonData.name}</Heading>
            <Heading as='h6'>{lessonData.description}</Heading>
            {
                lessonData?.content?.mdxCompiled
                ? <MDXRenderer data={lessonData.content.mdxCompiled} />
                : <div>No lesson content</div>
            }
            {
                lessonData?.transcript?.mdxCompiled
                ? <MDXRenderer data={lessonData.transcript.mdxCompiled} />
                : <div>No transcript</div>
            }
            <ToastSearchParams />
        </div>
    );
}