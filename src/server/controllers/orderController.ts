import { Video } from "@prisma/client";
import * as z from "zod";
import { 
    DbUpsertCourseByIdProps,
    dbDeleteCourse,
    dbDeleteCourseDetailsById, 
    dbDeleteLesson, 
    dbDeleteLessonContentById, 
    dbDeleteLessonTranscriptById, 
    dbDeleteVideoById, 
    dbGetCourseAndDetailsAndLessonsById, 
    dbGetCourseById, 
    dbGetCourseBySlug, 
    dbGetLessonAndRelationsById, 
    dbGetUserData, 
    dbGetVideoFileNameByVideoId, 
    dbUpdateUserStripeCustomerId, 
    dbUpsertCourseById
} from "./dbController";
import { gcDeleteVideoFile } from "./gcController";
import { checkIfAdmin, getServerAuthSession, requireAdminAuth } from "../auth";
import { colorLog, sleep } from "@/utils/utils";
import { 
    stripeArchivePrice, 
    stripeArchiveProduct, 
    stripeCreateCheckoutSession, 
    stripeCreateCustomer, 
    stripeCreatePrice, 
    stripeCreateProduct, 
    stripeUpdateProduct 
} from "./stripeController";

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
 * calling the correct function using the course id. Will first check if course has any lessons, and, if so,
 * will order the deletion of the lesson (which will handle its video). Then archives attached Stripe resources.
 * After that, will cascade delete all remaining related model entries of course.
 * @access ADMIN
 */
async function orderDeleteCourse (id: string) {
    // Locally scoped helper functions
    async function archiveStripeResources ({ 
        stripeProductId, 
        stripeBasePriceId, 
        stripeSeminarPriceId, 
        stripeDialoguePriceId 
    }: {
        stripeProductId: string, 
        stripeBasePriceId: string, 
        stripeSeminarPriceId: string, 
        stripeDialoguePriceId: string
    }) {
        const archivedProduct = await stripeArchiveProduct({ stripeProductId });
        const archivedBasePrice = await stripeArchivePrice({ stripePriceId: stripeBasePriceId });
        const archivedSeminarPrice = await stripeArchivePrice({ stripePriceId: stripeSeminarPriceId });
        const archivedDialoguePrice = await stripeArchivePrice({ stripePriceId: stripeDialoguePriceId });
        return { archivedProduct, archivedBasePrice, archivedSeminarPrice, archivedDialoguePrice };
    }

    // Main function execution
    const deleteCourse = async () => {
        const validId = z.string().parse(id);
        const course = await dbGetCourseAndDetailsAndLessonsById(validId);
        if (!course) throw new Error("orderDeleteCourse Func: Course not found at db call");
        /**
         * Delete all related lessons and resources.
         */
        if (course.lessons.length > 0) {
            /**
             * Using `forEach()` will not work here, as it will not wait for the async function to finish.
             * Instead we use `map()` to create an array of promises, and then use `Promise.all()` 
             * to wait for all promises to resolve.
             */
            const deleteLessonPromises = course.lessons.map(async (lesson) => {
                const deletedLesson = await orderDeleteLesson(lesson.id);
                colorLog(`===LESSON DELETED->ID: ${deletedLesson.id}`);
            })
            await Promise.all(deleteLessonPromises);
        }
        /**
         * Archive related Stripe resources if they exist.
         */
        if (course.stripeProductId && course.stripeBasePriceId && course.stripeSeminarPriceId && course.stripeDialoguePriceId) {
            await archiveStripeResources({
                stripeProductId: course.stripeProductId,
                stripeBasePriceId: course.stripeBasePriceId,
                stripeSeminarPriceId: course.stripeSeminarPriceId,
                stripeDialoguePriceId: course.stripeDialoguePriceId,
            });
            colorLog(`===STRIPE RESOURCES ARCHIVED->COURSE ID: ${course.id}`);
        } else {
            colorLog(`===NO OR INCOMPLETE STRIPE RESOURCES TO ARCHIVE->COURSE ID: ${course.id}`, "orange");
            throw new Error("orderDeleteCourse Func: Could not archive all stripe resources. Terminating delete process.");
        }
        /**
         * Finally, delete course entry.
         */
        const deletedCourse = await dbDeleteCourse({ id: validId });
        colorLog(`===COURSE DELETED->ID: ${deletedCourse.id}`);
        return deletedCourse;
    }
    return await checkIfAdmin(deleteCourse);
}
type OrderCreateOrUpdateCourseProps = 
    Omit<DbUpsertCourseByIdProps, "stripeProductId" | "stripeBasePriceId" | "stripeSeminarPriceId" | "stripeDialoguePriceId">;
/**
 * Higher order controller function that organizes the creation or update of a Course entry. Integrated with Stripe API,
 * so it wil attempt to update the Stripe resources if they already exist, or create them if they don't.
 * @access ADMIN
 */
export async function orderCreateOrUpdateCourse ({ 
    id, 
    name, 
    description, 
    slug,
    basePrice,
    seminarPrice,
    dialoguePrice, 
    imageUrl, 
    published, 
    author 
}: OrderCreateOrUpdateCourseProps) {
    // Locally scoped helper functions
    async function updateStripePriceIfNeeded({ 
        stripePriceId, productId, existingPrice, incomingPrice
    }: {
        stripePriceId: string, productId: string, existingPrice: number, incomingPrice: number
    }) {
        /**
         * This check occurs *only* between incoming price from the App and the registered price in the database.
         * This saves an API call but is less rigorous.
         * Consider a fault  where the price in the database check fails, but the prices is updated in db but
         * not in Stripe. This would result in a price mismatch between the App and Stripe.
         */
        if (incomingPrice !== existingPrice) {
            await stripeArchivePrice({ stripePriceId: stripePriceId });
            const newPrice = await stripeCreatePrice({ stripeProductId: productId, unitPrice: incomingPrice });
            return newPrice;
        }
        return;
    }

    async function createStripeResources() {
        const product = await stripeCreateProduct({ name, description, imageUrl });
        const stripeBasePrice = await stripeCreatePrice({ stripeProductId: product.id, unitPrice: basePrice });
        const stripeSeminarPrice = await stripeCreatePrice({ stripeProductId: product.id, unitPrice: seminarPrice });
        const stripeDialoguePrice = await stripeCreatePrice({ stripeProductId: product.id, unitPrice: dialoguePrice });
        return { product, stripeBasePrice, stripeSeminarPrice, stripeDialoguePrice };
    }

    async function updateStripeResources({
        stripeProductId, 
        stripeBasePriceId, 
        stripeSeminarPriceId, 
        stripeDialoguePriceId, 
        existingBasePrice, 
        existingSeminarPrice,
        existingDialoguePrice
    }: { 
        stripeProductId: string, 
        stripeBasePriceId: string, 
        stripeSeminarPriceId: string, 
        stripeDialoguePriceId: string, 
        existingBasePrice: number, 
        existingSeminarPrice: number, 
        existingDialoguePrice: number
    }) {
        const product = await stripeUpdateProduct({ stripeProductId, name, description, imageUrl });
        const stripeBasePrice = await updateStripePriceIfNeeded({ 
            stripePriceId: stripeBasePriceId, 
            productId: product.id, 
            incomingPrice: basePrice, 
            existingPrice: existingBasePrice,
        });
        const stripeSeminarPrice = await updateStripePriceIfNeeded({ 
            stripePriceId: stripeSeminarPriceId, 
            productId: product.id, 
            incomingPrice: seminarPrice,
            existingPrice: existingSeminarPrice,
        });
        const stripeDialoguePrice = await updateStripePriceIfNeeded({ 
            stripePriceId: stripeDialoguePriceId, 
            productId: product.id, 
            incomingPrice: dialoguePrice,
            existingPrice: existingDialoguePrice,
        });
        return { product, stripeBasePrice, stripeSeminarPrice, stripeDialoguePrice };
    }

    // Main function execution
    try {
        await requireAdminAuth();
        const existingCourse = await dbGetCourseById(id ?? "x");

        if (!existingCourse) {
            const { product, stripeBasePrice, stripeSeminarPrice, stripeDialoguePrice } = await createStripeResources();
            const dbPayload = {
                id,
                name,
                description,
                slug,
                imageUrl,
                published,
                author,
                basePrice,
                seminarPrice,
                dialoguePrice,
                stripeProductId: product.id,
                stripeBasePriceId: stripeBasePrice.id,
                stripeSeminarPriceId: stripeSeminarPrice.id,
                stripeDialoguePriceId: stripeDialoguePrice.id,
            }
            const course = await dbUpsertCourseById(dbPayload);
            return course;
        }

        if (!existingCourse.stripeProductId 
            || !existingCourse.stripeBasePriceId 
            || !existingCourse.stripeSeminarPriceId 
            || !existingCourse.stripeDialoguePriceId
            || !existingCourse.basePrice
            || !existingCourse.seminarPrice
            || !existingCourse.dialoguePrice
        ) throw new Error("Requisite Stripe resource entries not found at db call. \n" + JSON.stringify(existingCourse, null, 2));

        const { product, stripeBasePrice, stripeSeminarPrice, stripeDialoguePrice } = await updateStripeResources({
            stripeProductId: existingCourse.stripeProductId,
            stripeBasePriceId: existingCourse.stripeBasePriceId,
            existingBasePrice: existingCourse.basePrice,
            existingSeminarPrice: existingCourse.seminarPrice,
            existingDialoguePrice: existingCourse.dialoguePrice,
            stripeSeminarPriceId: existingCourse.stripeSeminarPriceId,
            stripeDialoguePriceId: existingCourse.stripeDialoguePriceId,
        });

        const updatedStripeBasePriceId = stripeBasePrice?.id ?? existingCourse.stripeBasePriceId;
        const updatedStripeSeminarPriceId = stripeSeminarPrice?.id ?? existingCourse.stripeSeminarPriceId;
        const updatedStripeDialoguePriceId = stripeDialoguePrice?.id ?? existingCourse.stripeDialoguePriceId;

        const dbPayload = {
            id,
            name,
            description,
            slug,
            imageUrl,
            published,
            author,
            basePrice,
            seminarPrice,
            dialoguePrice,
            stripeProductId: product.id,
            stripeBasePriceId: updatedStripeBasePriceId,
            stripeSeminarPriceId: updatedStripeSeminarPriceId,
            stripeDialoguePriceId: updatedStripeDialoguePriceId,
        }
        const course = await dbUpsertCourseById(dbPayload);
        
        return course;

    } catch(e) {
        // Here we may want to check which resources were created and delete them if necessary,
        // but it is preferable to preserve data and handle errors manually.
        throw e;
    }
}

export async function orderCreateCheckout(slug: string, priceTier: string) {
    const session = await getServerAuthSession();
    if (!session) throw new Error("Session missing");

    let userData = await dbGetUserData(session.user.id);
    if (!userData) throw new Error("Could not retrieve user data");

    if (userData.stripeCustomerId === null) {
        if (userData.email === null) throw new Error("User email is null");
        const customer = await stripeCreateCustomer({
            email: userData.email,
            userId: userData.id,
            name: userData.name ?? undefined,
        });
        userData = await dbUpdateUserStripeCustomerId({
            userId: userData.id,
            stripeCustomerId: customer.id,
        });
    }

    const course = await dbGetCourseBySlug(slug);
    if (!course) throw new Error("Course not found");

    let priceId = "";
    switch(priceTier) {
        case "base":
            if (!course.stripeBasePriceId) throw new Error("Course does not have a base price");
            priceId = course.stripeBasePriceId;
            break;
        case "seminar":
            if (!course.stripeSeminarPriceId) throw new Error("Course does not have a seminar price");
            priceId = course.stripeSeminarPriceId;
            break;
        case "dialogue":
            if (!course.stripeDialoguePriceId) throw new Error("Course does not have a dialogue price");
            priceId = course.stripeDialoguePriceId;
            break;
        default:
            throw new Error("Invalid priceTier");
    }

    if (!userData.stripeCustomerId) throw new Error("User does not have a stripeCustomerId");

    const checkout = await stripeCreateCheckoutSession({
        customerId: userData.stripeCustomerId,
        userId: userData.id,
        purchase: {
            price: priceId,
            quantity: 1,
            adjustable_quantity: {
                enabled: false,
            }
        },
        slug: slug,
    })

    return { url: checkout.url };
}