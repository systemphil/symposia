"use client";

import type { Course, Lesson } from "@prisma/client";
import CourseForm, { UpdateCourseInputs } from "./forms/CourseForm";
import { apiClientside } from "@/lib/trpc/trpcClientside";
import { type dbGetCourseAndLessonsBySlug } from "@/server/controllers/courses";
import { type SubmitHandler } from "react-hook-form";


const AdminCourseFormContainer = ({
    initialCourse, 
    slug 
}: {
    slug: string;
    initialCourse: Awaited<ReturnType<(typeof dbGetCourseAndLessonsBySlug)>>
}) => {
    const {data: course} = apiClientside.courses.getCourseAndLessonsBySlug.useQuery({slug: slug}, {
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

    const onSubmit: SubmitHandler<UpdateCourseInputs> = async data => {
        updateCourseMutation.mutate(data);
    };

    return (
        <>
            <CourseForm onSubmit={onSubmit} course={course} isLoading={updateCourseMutation.isLoading} />
        </>
    )
}

export default AdminCourseFormContainer;