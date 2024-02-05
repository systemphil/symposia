"use client";

import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import TextInput from './TextInput';
import TextAreaInput from './TextAreaInput';
import SubmitInput from './SubmitInput';
import Checkbox from "./Checkbox";
import { DbUpsertCourseByIdProps } from "@/server/controllers/dbController";
import NumberInput from "./NumberInput";
import { useParams, useRouter } from "next/navigation";
import { apiClientside } from "@/lib/trpc/trpcClientside";
import toast from "react-hot-toast";

export const CourseForm = ({id}: {id?: string}) => {
    const router = useRouter();
    const params = useParams();
    const utils = apiClientside.useContext();
    const {data: course, isLoading } = apiClientside.db.getCourseAndLessonsById.useQuery({id: id}, {
        refetchOnMount: false,
        refetchOnReconnect: false,
        enabled: id ? true : false,
    });
    const buttonLoading = id ? isLoading : false;

    const updateCourseMutation = apiClientside.db.upsertCourse.useMutation({
        onSuccess: (newData) => {
            toast.success('Course updated successfully')
            // If course is new, it should not match existing path and push user to new path. Otherwise, refresh data.
            if (params.courseId !== newData.id) {
                console.log("pushing to new route")
                router.push(`/admin/courses/${newData.id}`)
            } else {
                void utils.db.invalidate();
            }
        },
        onError: (error) => {
            console.error(error)
            toast.error('Something went wrong. Please try again. If the problem persists, contact support.')
        }
    })

    const onSubmit: SubmitHandler<DbUpsertCourseByIdProps> = async data => {
        updateCourseMutation.mutate(data);
    };

    const methods = useForm<DbUpsertCourseByIdProps>({
        values: {
            id: course?.id ?? "",
            name: course?.name ?? "", 
            slug: course?.slug ?? "",
            description: course?.description ?? "",
            stripeBasePriceId: course?.stripeBasePriceId ?? "",
            stripeSeminarPriceId: course?.stripeSeminarPriceId ?? "",
            stripeDialoguePriceId: course?.stripeDialoguePriceId ?? "",
            stripeProductId: course?.stripeProductId ?? "",
            basePrice: course?.basePrice ?? 0,
            seminarPrice: course?.seminarPrice ?? 0,
            dialoguePrice: course?.dialoguePrice ?? 0,
            imageUrl: course?.imageUrl ?? "",
            author: course?.author ?? "",
            published: course?.published ?? false,
        },
    });

    return (
        <FormProvider {...methods}>
            <form className='flex flex-col max-w-lg' onSubmit={methods.handleSubmit(onSubmit)}>
                <TextInput label='Name*' name='name' options={{ required: true }} />
                <TextInput label='Slug*' name='slug' options={{ required: true }} />
                <TextAreaInput label='Description*' name='description' options={{ required: true }} />
                <p className="font-semibold">⚠️ Price is in <b>cents</b>, so be sure to add two extra 00 at the end</p>
                <NumberInput label='Base Price* (in cents)' name='basePrice' options={{ valueAsNumber: true, required: true }} />
                <NumberInput label='Seminar Price* (in cents)' name='seminarPrice' options={{ valueAsNumber: true, required: true }} />
                <NumberInput label='Dialogue Price* (in cents)' name='dialoguePrice' options={{ valueAsNumber: true, required: true }} />
                <TextInput label='Image URL' name='imageUrl' options={{ required: false }} />
                <TextInput label='Author' name='author' options={{ required: false }} />
                <Checkbox label='Publish' name='published' />
                <SubmitInput value={`${course ? 'Update' : 'Create'} course`} isLoading={buttonLoading} />
            </form>
        </FormProvider>
    )
}
