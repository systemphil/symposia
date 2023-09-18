import Editor from "@/components/Editor";
import { dbGetLessonAndRelationsById, dbGetMdxContentByModelId } from "@/server/controllers/coursesController";

/**
 * Common route for models LessonContent and LessonTranscript that fetches respective data and renders the MDX Editor to the UI.
 * @description Instead of having two routes, one for LessonContent and LessonTranscript, which would be nearly identical and call the same functions, a common route is implemented that uses a common variable and searches the database by id. This is possible because the id of the entries are guaranteed (by Prisma) to be unique across tables.
 */
export default async function AdminLessonMaterialEdit ({ 
    params 
}: { 
    params: { courseId: string, lessonId: string, lessonMaterialId: string }
}) {
    const lessonId = params.lessonId;
    const lessonMaterialId = params.lessonMaterialId;
    if (typeof lessonMaterialId !== "string") { throw new Error("missing lessonContent id") };

    const lessonMaterial = await dbGetMdxContentByModelId(lessonMaterialId);
    const lesson = await dbGetLessonAndRelationsById(lessonId);

    if (!lessonMaterial) {
        throw new Error("Lesson Material not found");
    }
    if (!lesson) {
        throw new Error("Lesson not found");
    }

    return(
        <Editor initialMaterial={lessonMaterial} title={lesson.name}/>
    )
}