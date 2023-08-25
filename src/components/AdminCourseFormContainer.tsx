"use client";

import CourseForm, { UpsertCourseInputs } from "./forms/CourseForm";
import { apiClientside } from "@/lib/trpc/trpcClientside";
import { type dbGetCourseAndLessonsById } from "@/server/controllers/courses";
import { type SubmitHandler } from "react-hook-form";


const AdminCourseFormContainer = ({
    initialCourse, 
    id 
}: {
    id: string;
    initialCourse: Awaited<ReturnType<(typeof dbGetCourseAndLessonsById)>>
}) => {
    const {data: course} = apiClientside.courses.getCourseAndLessonsById.useQuery({id: id}, {
        initialData: initialCourse,
        refetchOnMount: false,
        refetchOnReconnect: false,
    });

    const updateCourseMutation = apiClientside.courses.upsertCourse.useMutation({
        onSuccess: () => {
        // toast.success('Course updated successfully')
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