import Editor from "@/components/Editor";
import { dbGetCourseAndDetailsAndLessonsById, dbGetMdxByModelId } from "@/server/controllers/dbController";

/**
 * Fetches data for CourseDetails and renders the MDX Editor to the UI.
 */
export default async function AdminLessonMaterialEdit ({ 
    params 
}: { 
    params: { courseId: string, courseDetailsId: string }
}) {
    const courseId = params.courseId;
    const courseDetailsId = params.courseDetailsId;
    if (typeof courseDetailsId !== "string") { throw new Error("missing lessonContent id") };

    const editorMaterial = await dbGetMdxByModelId(courseDetailsId);
    const course = await dbGetCourseAndDetailsAndLessonsById(courseId);

    if (!editorMaterial) {
        throw new Error("CourseDetails not found");
    }
    if (!course) {
        throw new Error("Course not found");
    }

    return(
        <Editor initialMaterial={editorMaterial} title={course.name}/>
    )
}