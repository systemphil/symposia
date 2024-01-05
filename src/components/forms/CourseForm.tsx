import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import TextInput from './TextInput';
import TextAreaInput from './TextAreaInput';
import SubmitInput from './SubmitInput';
import Checkbox from "./Checkbox";
import { Lesson, Course } from "@prisma/client";
import { DbUpsertCourseByIdProps, type dbGetCourseAndDetailsAndLessonsById } from "@/server/controllers/coursesController";
import NumberInput from "./NumberInput";

type Props = {
    course?: Awaited<ReturnType<(typeof dbGetCourseAndDetailsAndLessonsById)>>;
    onSubmit: SubmitHandler<DbUpsertCourseByIdProps>;
    isLoading: boolean;
}

const CourseForm = ({ course, onSubmit, isLoading }: Props) => {
    const methods = useForm<DbUpsertCourseByIdProps>({ 
        defaultValues: {
            id: course?.id,
            name: course?.name, 
            slug: course?.slug,
            description: course?.description,
            basePrice: course?.basePrice,
            seminarPrice: course?.seminarPrice,
            dialoguePrice: course?.dialoguePrice,
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
                <NumberInput label='Base Price*' name='basePrice' options={{ required: true }} />
                <NumberInput label='Seminar Price*' name='seminarPrice' options={{ required: true }} />
                <NumberInput label='Dialogue Price*' name='dialoguePrice' options={{ required: true }} />
                <TextInput label='Image URL' name='imageUrl' options={{ required: false }} />
                <TextInput label='Author' name='author' options={{ required: false }} />
                <Checkbox label='Publish' name='published' />
                <SubmitInput value={`${course ? 'Update' : 'Create'} course`} isLoading={isLoading} />
            </form>
        </FormProvider>
    )
}

export default CourseForm;