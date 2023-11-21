import { Video } from "@prisma/client";
import * as z from "zod";
import { 
    dbDeleteCourseDetailsById, 
    dbDeleteLesson, 
    dbDeleteLessonContentById, 
    dbDeleteLessonTranscriptById, 
    dbDeleteVideoById, 
    dbGetLessonAndRelationsById, 
    dbGetVideoFileNameByVideoId 
} from "./coursesController";
import { gcDeleteVideoFile } from "./gcController";
import { checkIfAdmin } from "../auth";


type CtrlVideoProps = Pick<Video, "id"> & Partial<Pick<Video, "fileName">> & { directory?: boolean };
/**
 * Higher order controller function that organizes the deletion of video file in storage and the entry from the database.
 * Requires the ID of the Video entry from db. `fileName` will be queried in the db if not provided.
 * @access "ADMIN"
 * @optional deleting `directory` of video file on storage is set to true by default but can be overridden to false
 */
export const orderDeleteVideo = async({id, fileName = "", directory = true}: CtrlVideoProps ) => {
    const deletionProcess = async () => {
        const validId = z.string().parse(id);
        let validFileName = z.string().parse(fileName);
        const validDirectory = z.boolean().parse(directory);

        if (fileName === "") {
            const video = await dbGetVideoFileNameByVideoId(validId);
            if (!video) throw new Error("Video fileName not found at db call");
            validFileName = video.fileName;
        }

        const directoryAndVideoToDelete = {
            id: validId,
            fileName: validFileName,
            directory: validDirectory,
        }
        await gcDeleteVideoFile(directoryAndVideoToDelete);
        await dbDeleteVideoById({ id: validId });
        return;
    }
    return await checkIfAdmin(deletionProcess);
}
export type ModelName = "LessonTranscript" | "LessonContent" | "Video" | "CourseDetails" | "Lesson"
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
const orderDeleteLesson = async (id: string) => {
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
        await dbDeleteLesson({ id: validId });
    }
    return await checkIfAdmin(deletionAtOrderDeleteLession);
}
/**
 * Higher order controller function that organizes the deletion of model entries by 
 * calling the correct function using the model name as a switch statement filter.
 * @access ADMIN
 * @description For video entries, the deletion of the video file in storage is also handled.
 */
export const orderDeleteModelEntry = async({id, modelName}: OrderDeleteModelEntryProps) => {
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
                const videoArgs = {
                    id: validId,
                    directory: true,
                }
                return await orderDeleteVideo(videoArgs);
            case "Lesson":
                return await orderDeleteLesson(validId);
        }
    }
    return await checkIfAdmin(deleteEntry);
}

// TODO - add orderDeleteCourse