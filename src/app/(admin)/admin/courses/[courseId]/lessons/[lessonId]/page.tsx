import Link from 'next/link'
import { dbGetLessonAndRelationsById } from '@/server/controllers/dbController';
import Heading from '@/components/Heading';
import LessonForm from '@/components/forms/LessonForm';
import CourseMaterialCard from '@/components/CourseMaterialCard';
import VideoForm from '@/components/forms/VideoForm';


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

            <div className="flex flex-col gap-24">
                <div>
                    <Heading as='h4'>Lesson Content</Heading>
                    {(
                        lesson.content
                    ) ? (
                        <CourseMaterialCard 
                            href={`/admin/courses/${courseId}/lessons/${lessonId}/lesson-material/${lesson.content.id}`} 
                            id={lesson.content.id}
                            modelName='LessonContent'
                            heading={lesson.name}
                        />
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
                    <VideoForm />
                </div>

                <div>
                    <Heading as='h4'>Transcript</Heading>
                    {(
                        lesson.transcript
                    ) ? (
                        <CourseMaterialCard 
                            href={`/admin/courses/${courseId}/lessons/${lessonId}/lesson-material/${lesson.transcript.id}`}
                            id={lesson.transcript.id}
                            modelName='LessonTranscript'
                            heading={lesson.name}
                        />
                    ) : (
                        <div>
                            <Heading as='h2'>No transcript.</Heading>
                            <Link href={`/admin/courses/${courseId}/lessons/${lessonId}/lesson-transcript/new`}>
                                <button className="btn btn-primary">Add content</button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}