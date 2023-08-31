"use client";

import CourseForm, { UpsertCourseInputs } from "./forms/CourseForm";
import { apiClientside } from "@/lib/trpc/trpcClientside";
import { type dbGetCourseAndLessonsById } from "@/server/controllers/coursesController";
import { useParams, useRouter } from "next/navigation";
import { type SubmitHandler } from "react-hook-form";

/**
 * TODO REFACTOR this with CourseForm to create a single component
 */
const AdminCourseFormContainer = ({
    initialCourse, 
    id 
}: {
    id?: string;
    initialCourse?: Awaited<ReturnType<(typeof dbGetCourseAndLessonsById)>>
}) => {
    const router = useRouter();
    const params = useParams();
    const utils = apiClientside.useContext();
    const {data: course} = apiClientside.courses.getCourseAndLessonsById.useQuery({id: id}, {
        initialData: initialCourse,
        refetchOnMount: false,
        refetchOnReconnect: false,
        enabled: id ? true : false,
    });

    const updateCourseMutation = apiClientside.courses.upsertCourse.useMutation({
        onSuccess: (newData) => {
            // toast.success('Course updated successfully')
            // If course is new, it should not match existing path and push user to new path. Otherwise, refresh data.
            if (params.courseId !== newData.id) {
                console.log("pushing to new route")
                router.push(`/admin/courses/${newData.id}`)
            } else {
                void utils.courses.invalidate();
            }
        },
        onError: (error) => {
            console.error(error)
            // toast.error('Something went wrong')
        }
    })

    const onSubmit: SubmitHandler<UpsertCourseInputs> = async data => {
        updateCourseMutation.mutate(data);
    };

    return (
        <>
            <CourseForm onSubmit={onSubmit} course={course} isLoading={updateCourseMutation.isLoading} />
        </>
    )
}

export default AdminCourseFormContainer;