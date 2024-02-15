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
import ImageFileInput from "./ImageFileInput";
import { useState } from "react";
import Image from 'next/image'
import { UploadProfileImageResponse } from "@/app/api/image-upload/route";
import { sleep } from "@/utils/utils";

export const CourseForm = ({id}: {id?: string}) => {
    const [ currentImageUrl, setCurrentImageUrl ] = useState<string>("");
    const [ submitLoading, setSubmitLoading ] = useState<boolean>(false);
    const router = useRouter();
    const params = useParams();
    const utils = apiClientside.useContext();
    const { data: course, isLoading } = apiClientside.db.getCourseAndLessonsById.useQuery({ id: id }, {
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
                setSubmitLoading(false);
                router.push(`/admin/courses/${newData.id}`)
            } else {
                setSubmitLoading(false);
                void utils.db.invalidate();
            }
        },
        onError: (error) => {
            console.error(error)
            toast.error('Something went wrong. Please try again. If the problem persists, contact support.')
        }
    })

    const onSubmit: SubmitHandler<DbUpsertCourseByIdProps> = async data => {
        try {
            setSubmitLoading(true); 
            updateCourseMutation.mutate(data);
        } catch (error) {
            console.error(error);
            toast.error('Oops! Something went wrong');
        } finally {
            setSubmitLoading(false);
        }
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

    // Event handlers and other hooks
    const handleSelectedFileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const file = e.target && e.target.files && e.target.files[0];
        if (!file) {
            toast.error('No file selected');
            return;
        }
        const { imageUrl } = await uploadImage(file);
        toast.success('Image uploaded!');
        methods.setValue('imageUrl', imageUrl);
        await sleep(1000);
        setCurrentImageUrl(imageUrl);
    }

    const uploadImage = async (file: File) => {
        const body = new FormData();
        body.set('image', file);

        const response = await fetch('/api/image-upload', {
            method: 'POST',
            body,
        });
        if (!response.ok) {
            toast.error('Error uploading profile image');
            throw new Error('Error uploading profile image');
        }

        const result: UploadProfileImageResponse = await response.json();
        if (!result) {
            toast.error('Error uploading profile image');
            throw new Error('Error uploading profile image');
        }
        return result;
    }

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
                <div className="h-[500px] min-w-[500px]">
                    { course?.imageUrl && !currentImageUrl &&
                        <>
                            <p className="font-bold">Current Course Image:</p>
                            <Image src={course.imageUrl} alt="Current Course Image" width={500} height={500} /> 
                        </>
                    }
                    {currentImageUrl && (
                        <>
                            <p style={{ fontWeight: "bolder" }}>New Course Image:</p>
                            {/* <img src={currentImageUrl} alt="New Course Image" width={500} /> */}
                            <Image src={currentImageUrl} alt="New Course Image" width={500} height={500} /> 
                        </>
                    )}
                    {!course?.imageUrl && !currentImageUrl &&
                        <p>No image uploaded</p>
                    }
                </div>
                <ImageFileInput 
                    label='Image' 
                    name='fileInput' 
                    options={{ 
                        required: false,
                        onChange: (e) => handleSelectedFileImageChange(e),
                    }}  
                />
                <TextInput label='Author' name='author' options={{ required: false }} />
                <Checkbox label='Publish' name='published' />
                <SubmitInput value={`${course ? 'Update' : 'Create'} course`} isLoading={buttonLoading || submitLoading} />
            </form>
            <button className="btn btn-accent" onClick={() => {console.log(methods.getValues())}}>DEBUG: Get form values</button>
        </FormProvider>
    )
}
