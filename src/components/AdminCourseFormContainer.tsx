"use client";

import type { Course, Lesson } from "@prisma/client";
import CourseForm from "./forms/CourseForm";
import { apiClientside } from "@/lib/trpc/trpcClientside";
import { type dbGetCourseAndLessonsBySlug } from "@/server/controllers/courses";

type CourseUpdateResult = {
    id: number;
  }

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
    
    // const handler = (data: Inputs) => {
    //     return fetch(`/api/courses/${course.id}`, {
    //     method: 'PUT', body: JSON.stringify(data)
    //     }).then(res => res.json())
    // }

    // const mutation = useMutation(handler, {
    //     onSuccess: (data: CourseUpdateResult) => {
    //     // toast.success('Course updated successfully')
    //     },
    //     onError: (error) => {
    //     console.error(error)
    //     // toast.error('Something went wrong')
    //     }
    // })

    // const onSubmit: SubmitHandler<Inputs> = async data => {
    //     mutation.mutate(data);
    // };

    return (
        <>
            <CourseForm onSubmit={onSubmit} course={course} isLoading={mutation.isLoading} />
        </>
    )
}

export default AdminCourseFormContainer;