import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import TextInput from './TextInput';
import TextAreaInput from './TextAreaInput';
import SubmitInput from './SubmitInput';
import Checkbox from "./Checkbox";
import { Lesson, Course } from "@prisma/client";
import { type dbGetCourseAndLessonsBySlug } from "@/server/controllers/courses";

export type UpdateCourseInputs = {
    slug: string;
    name: string;
    description: string;
};

type Props = {
    course?: Awaited<ReturnType<(typeof dbGetCourseAndLessonsBySlug)>>;
    onSubmit: SubmitHandler<UpdateCourseInputs>;
    isLoading: boolean;
}

const CourseForm = ({ course, onSubmit, isLoading }: Props) => {
    const methods = useForm<UpdateCourseInputs>({ 
        defaultValues: {
            name: course?.name, 
            description: course?.description,
            slug: course?.slug, 
        } 
    });

    return (
        <FormProvider {...methods}>
            <form className='flex flex-col max-w-lg' onSubmit={methods.handleSubmit(onSubmit)}>
                <TextInput label='Name' name='name' options={{ required: true }} />
                <TextInput label='Slug' name='slug' options={{ required: true }} />
                <TextAreaInput label='Description' name='description' options={{ required: true }} />
                <Checkbox label='Publish' name='published' />
                <SubmitInput value={`${course ? 'Update' : 'Create'} course`} isLoading={isLoading} />
            </form>
        </FormProvider>
    )
}

export default CourseForm;