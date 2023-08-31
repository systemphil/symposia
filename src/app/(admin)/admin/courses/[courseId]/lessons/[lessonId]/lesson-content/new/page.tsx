import { dbGetLessonAndRelationsById, dbUpsertLessonContentById } from "@/server/controllers/coursesController";
import { redirect } from "next/navigation";

/**
 * Intermediate route that creates a new LessonContent entry unless it exists and pushes the user to that route.
 * @description Should never display any UI
 */
export default async function AdminLessonContentNew ({ params }: { params: { courseId: string, lessonId: string } }) {

    const lessonId = params.lessonId;
    const courseId = params.courseId;
    if (typeof lessonId !== "string" || typeof courseId !== "string") { throw new Error("missing course or lesson id") };

    const lesson = await dbGetLessonAndRelationsById(lessonId);
    
    if (lesson && lesson.content && lesson.content.id) {
        // If lessonContent already exists, push to that.
        console.log("=== LESSONCONTENT exists")
        redirect(`/admin/courses/${courseId}/lessons/${lessonId}/lesson-content/${lesson.content.id}`);
    }
    const newLessonDetails = {
        lessonId: lessonId,
        content: "Hello **world**"
    }

    const newLessonContent = await dbUpsertLessonContentById(newLessonDetails);
    if (newLessonContent && newLessonContent.id) {
        // If new LessonContent entry was created successfully, push user to route.
        console.log("=== LESSONCONTENT created and redirecting")
        redirect(`/admin/courses/${courseId}/lessons/${lessonId}/lesson-content/${newLessonContent.id}`);
    }

    return(
        <p>You should never see this message. An error occured somewhere.</p>
    )
}