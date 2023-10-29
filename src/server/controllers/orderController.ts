import { Video } from "@prisma/client";
import * as z from "zod";
import { 
    dbDeleteCourseDetailsById, 
    dbDeleteLessonContentById, 
    dbDeleteLessonTranscriptById, 
    dbDeleteVideoById, 
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
 * Higher order controller function that organizes the deletion of model entries by 
 * calling the correct function using the model name as a switch statement filter.
 * @access ADMIN
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
                console.error("INCOMPLETE");
                throw new Error("INCOMPLETE");
        }
    }
    return await checkIfAdmin(deleteEntry);
}