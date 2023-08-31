import Link from 'next/link'
import { dbGetLessonAndRelationsById } from '@/server/controllers/coursesController';
import Heading from '@/components/Heading';
import LessonForm from '@/components/forms/LessonForm';


export default async function AdminLessonEdit ({ params }: { params: { courseId: string, lessonId: string }}) {
    const lessonId = params.lessonId;
    const courseId = params.courseId;
    if (typeof lessonId !== "string" || typeof courseId !== "string") { throw new Error("missing course or lesson id") };

    const lesson = await dbGetLessonAndRelationsById(lessonId);

    if (!lesson) {
        return(
            <Heading as="h2">No lesson found</Heading>
        )
    }

    return (
        <div className='grid md:grid-cols-2'>
            <div>
                <Heading as='h2'>{lesson.name}</Heading>
                <LessonForm initialLesson={lesson} courseId={courseId} lessonId={lessonId}/>
            </div>

            {/* 
                // TODO decide whther to create deeper routes or use this page as baseline for reactive components.
                // TODO seems to me that we don't really need to nest deeper as the lesson id is the necessary element
                // TODO for all the attachment of lesson
             */}

            

            <div className="flex flex-col gap-24">

                <div>
                    <Heading as='h4'>Lesson Content</Heading>
                    {(
                        lesson.content
                    ) ? (
                        <Link key={lesson.content.id} href={`/admin/courses/${courseId}/lessons/${lessonId}/lesson-content/${lesson.content.id}`}>
                                <div className='flex gap-4 border border-gray-200 rounded-lg mb-6 cursor-pointer hover:bg-slate-200 duration-300 tooltip' data-tip="Click to edit">
                                    <div className='flex p-2'>
                                        <Heading as='h3'>{lesson.name}</Heading>
                                    </div>
                                </div>
                        </Link>
                    ) : (
                        <div>
                            <Heading as='h2'>No content.</Heading>
                            <Link href={`/admin/courses/${courseId}/lessons/${lessonId}/lesson-content/new`}>
                                <button className="btn btn-primary">Add content</button>
                            </Link>
                        </div>
                    )}
                </div>
                    
                <div>
                    <Heading as='h4'>Lesson Video</Heading>
                    {(
                        lesson.video
                    ) ? (
                        <Link key={lesson.video.id} href={`/admin/courses/${courseId}/lessons/${lessonId}/lesson-video/${lesson.video.id}`}>
                                <div className='flex gap-4 border border-gray-200 rounded-lg mb-6 cursor-pointer hover:bg-slate-200 duration-300 tooltip' data-tip="Click to edit">
                                    <div className='flex py-2'>
                                        <Heading as='h3'>{lesson.name} Video</Heading>
                                    </div>
                                </div>
                        </Link>
                    ) : (
                        <div>
                            <Heading as='h2'>No video.</Heading>
                            <Link href={`/admin/courses/${courseId}/lessons/${lessonId}/lesson-video/new`}>
                                <button className="btn btn-primary">Add video</button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}