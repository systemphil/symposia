import { Video } from "@prisma/client";
import * as z from "zod";
import { 
    dbDeleteCourse,
    dbDeleteCourseDetailsById, 
    dbDeleteLesson, 
    dbDeleteLessonContentById, 
    dbDeleteLessonTranscriptById, 
    dbDeleteVideoById, 
    dbGetCourseAndDetailsAndLessonsById, 
    dbGetLessonAndRelationsById, 
    dbGetVideoFileNameByVideoId 
} from "./coursesController";
import { gcDeleteVideoFile } from "./gcController";
import { checkIfAdmin } from "../auth";
import { colorLog } from "@/utils/utils";

type OrderDeleteVideoProps = Pick<Video, "id"> & Partial<Pick<Video, "fileName">>
/**
 * Higher order controller function that organizes the deletion of video file in storage and the entry from the database.
 * Requires the ID of the Video entry from db. `fileName` will be queried in the db if not provided.
 * @access "ADMIN"
 * @note GCP Storage "directories" are automatically deleted when empty.
 */
export async function orderDeleteVideo ({id, fileName = ""}: OrderDeleteVideoProps ) {
    const deletionProcess = async () => {
        const validId = z.string().parse(id);
        let validFileName = z.string().parse(fileName);

        if (fileName === "") {
            const video = await dbGetVideoFileNameByVideoId(validId);
            if (!video) throw new Error("Video fileName not found at db call");
            validFileName = video.fileName;
        }

        const directoryAndVideoToDelete = {
            id: validId,
            fileName: validFileName,
        }
        await gcDeleteVideoFile(directoryAndVideoToDelete);
        return await dbDeleteVideoById({ id: validId });
    }
    return await checkIfAdmin(deletionProcess);
}
export type ModelName = "LessonTranscript" | "LessonContent" | "Video" | "CourseDetails" | "Lesson" | "Course";
type OrderDeleteModelEntryProps = {
    id: string;
    modelName: ModelName;
}
/**
 * Higher order controller function that organizes the deletion of a lesson entry by
 * calling the correct function using the lesson id. Will first check if the lesson has a video entry,
 * and if so, will delete the video file in storage and the video entry in the database, before
 * deleting the lesson entry and cascade delete all related model entries.
 * @access ADMIN
 */
async function orderDeleteLesson (id: string) {
    const deletionAtOrderDeleteLession = async () => {
        const validId = z.string().parse(id);
        const lesson = await dbGetLessonAndRelationsById(validId);
        if (lesson && lesson.video) {
            const videoArgs = {
                id: lesson.video.id,
                directory: true,
            }
            await orderDeleteVideo(videoArgs);
        }
        const isLessonWithoutVideo = await dbGetLessonAndRelationsById(validId);
        if (isLessonWithoutVideo && isLessonWithoutVideo.video !== null) throw new Error("Lesson video not deleted");
        return await dbDeleteLesson({ id: validId });
    }
    return await checkIfAdmin(deletionAtOrderDeleteLession);
}
/**
 * Higher order controller function that organizes the deletion of model entries by 
 * calling the correct function using the model name as a switch statement filter.
 * @access ADMIN
 * @description For video entries, the deletion of the video file in storage is also handled.
 */
export async function orderDeleteModelEntry ({id, modelName}: OrderDeleteModelEntryProps) {
    const deleteEntry = async () => {
        const validId = z.string().parse(id);

        switch(modelName) {
            case "CourseDetails":
                return await dbDeleteCourseDetailsById({ id: validId });
            case "LessonContent":
                return await dbDeleteLessonContentById({ id: validId });
            case "LessonTranscript":
                return await dbDeleteLessonTranscriptById({ id: validId });
            case "Video":
                return await orderDeleteVideo({ id: validId });
            case "Lesson":
                return await orderDeleteLesson(validId);
            case "Course":
                return await orderDeleteCourse(validId);
        }
    }
    return await checkIfAdmin(deleteEntry);
}
/**
 * Higher order controller function that organizes the deletion of a course entry by
 * calling the correct function using the lesson id. Will first check if course has any lessons, and, if so,
 * will order the deletion of the lesson (which will handle its video). After that, will cascade delete 
 * all remaining related model entries of course.
 * @access ADMIN
 */
async function orderDeleteCourse (id: string) {
    const deleteCourse = async () => {
        const validId = z.string().parse(id);
        const course = await dbGetCourseAndDetailsAndLessonsById(validId);
        if (!course) throw new Error("Course not found at db call");
        if (course.lessons.length > 0) {
            /**
             * Using `forEach()` will not work here, as it will not wait for the async function to finish.
             * Instead we use `map()` to create an array of promises, and then use `Promise.all()` 
             * to wait for all promises to resolve.
             */
            const deleteLessonPromises = course.lessons.map(async (lesson) => {
                const deletedLesson = await orderDeleteLesson(lesson.id);
                colorLog(`===LESSON DELETED->ID: ${deletedLesson.id}`)
            })
            await Promise.all(deleteLessonPromises);
        }
        const deletedCourse = await dbDeleteCourse({ id: validId });
        colorLog(`===COURSE DELETED->ID: ${deletedCourse.id}`)
        return deletedCourse;
    }
    return await checkIfAdmin(deleteCourse);
}
