import Editor from "@/components/Editor";
import { dbGetLessonAndRelationsById, dbGetLessonContentOrLessonTranscriptById } from "@/server/controllers/coursesController";


export default async function AdminLessonContentEdit ({ params }: { params: { courseId: string, lessonId: string, lessonContentId: string }}) {
    const lessonId = params.lessonId;
    const lessonContentId = params.lessonContentId;
    if (typeof lessonContentId !== "string") { throw new Error("missing lessonContent id") };

    const lessonContent = await dbGetLessonContentOrLessonTranscriptById(lessonContentId);
    const lesson = await dbGetLessonAndRelationsById(lessonId)

    if (!lessonContent) {
        throw new Error("LessonContent not found");
    }
    if (!lesson) {
        throw new Error("Lesson not found");
    }

    return(
        <Editor initialLessonMaterial={lessonContent} lessonName={lesson.name}/>
    )
}