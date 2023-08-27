"use client";

import { apiClientside } from "@/lib/trpc/trpcClientside";
import { useParams, useRouter } from "next/navigation";

import type { dbGetLessonContentById } from "@/server/controllers/courses";
import { useForm, type SubmitHandler, FormProvider } from "react-hook-form";
import type { Lesson, LessonContent } from "@prisma/client";
import TextInput from "./TextInput";
import TextAreaInput from "./TextAreaInput";
import SubmitInput from "./SubmitInput";

/**
 * Form component for LessonContent data models. Must receive a lessonId, since every lessonContent presupposes
 * an existing lesson of which it is part of. May receive initial lessonContent and lessonId as props, 
 * in which case it will populate the form with existing data and activate the clientside 
 * query for refetching, otherwise it will start with a blank form. 
 */
const LessonContentForm = ({
    lessonId,
    initialLessonContent,
}: {
    lessonId?: Lesson["id"];
    initialLessonContent?: Awaited<ReturnType<(typeof dbGetLessonContentById)>>
}) => {
    const router = useRouter();
    const params = useParams();
    const utils = apiClientside.useContext();
    const {data: lessonContent} = apiClientside.courses.getLessonContentById.useQuery({id: initialLessonContent?.id}, {
        initialData: initialLessonContent,
        refetchOnMount: false,
        refetchOnReconnect: false,
        enabled: lessonId ? true : false,
    });

    const upsertLessonContentMutation = apiClientside.courses.upsertLessonContent.useMutation({
        onSuccess: () => {
            // toast.success('Course updated successfully')
            void utils.courses.invalidate();
        },
        onError: (error) => {
            console.error(error)
            // toast.error('Something went wrong')
        }
    })

    const onSubmit: SubmitHandler<LessonContent> = async data => {
        upsertLessonContentMutation.mutate(data);
    };

    const methods = useForm<LessonContent>({ 
        defaultValues: {
            id: lessonContent?.id,
            lessonId: lessonId,
            content: lessonContent?.content, 
        }
    });

    return (
        <FormProvider {...methods}>
            <form className='flex flex-col max-w-lg' onSubmit={methods.handleSubmit(onSubmit)}>
                <TextAreaInput label='Description*' name='description' options={{ required: true }} />
                {/* // TODO Add selection for partId here */}
                <SubmitInput value={`${lessonContent ? 'Update' : 'Create'} content`} isLoading={upsertLessonContentMutation.isLoading} />
            </form>
        </FormProvider>
    )
}

export default LessonContentForm;