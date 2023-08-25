import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import TextInput from './TextInput';
import TextAreaInput from './TextAreaInput';
import SubmitInput from './SubmitInput';
import Checkbox from "./Checkbox";
import { Lesson, Course } from "@prisma/client";
import { type dbGetCourseAndLessonsById } from "@/server/controllers/courses";

export type UpsertCourseInputs = {
    id: string;
    slug: string;
    name: string;
    description: string;
    imageUrl?: string | null | undefined;
    author?: string | null | undefined;
    published: boolean
};

type Props = {
    course?: Awaited<ReturnType<(typeof dbGetCourseAndLessonsById)>>;
    onSubmit: SubmitHandler<UpsertCourseInputs>;
    isLoading: boolean;
}

const CourseForm = ({ course, onSubmit, isLoading }: Props) => {
    const methods = useForm<UpsertCourseInputs>({ 
        defaultValues: {
            id: course?.id,
            name: course?.name, 
            description: course?.description,
            slug: course?.slug,
            imageUrl: course?.imageUrl,
            author: course?.author,
            published: course?.published
        } 
    });

    return (
        <FormProvider {...methods}>
            <form className='flex flex-col max-w-lg' onSubmit={methods.handleSubmit(onSubmit)}>
                <TextInput label='Name*' name='name' options={{ required: true }} />
                <TextInput label='Slug*' name='slug' options={{ required: true }} />
                <TextAreaInput label='Description*' name='description' options={{ required: true }} />
                <TextInput label='Image URL' name='imageUrl' options={{ required: false }} />
                <TextInput label='Author' name='author' options={{ required: false }} />
                <Checkbox label='Publish' name='published' />
                <SubmitInput value={`${course ? 'Update' : 'Create'} course`} isLoading={isLoading} />
            </form>
        </FormProvider>
    )
}

export default CourseForm;