import Link from 'next/link'
import { dbGetLessonById } from '@/server/controllers/courses';
import { redirect } from "next/navigation";
import Heading from '@/components/Heading';
import LessonForm from '@/components/forms/LessonForm';


export default async function AdminLessonEdit ({ params }: { params: { courseId: string, lessonId: string }}) {
    const lessonId = params.lessonId;
    const courseId = params.courseId;
    if (typeof lessonId !== "string") { throw new Error('missing course id') };

    const lesson = await dbGetLessonById(lessonId);

    if (!lesson) {
        console.log("No lesson found");
        redirect("/");
    }

    return (
        <div className='grid md:grid-cols-2'>
            <div>
                <Heading as='h2'>{lesson.name}</Heading>
                <LessonForm initialLesson={lesson} courseId={courseId} lessonId={lessonId}/>
            </div>

            <div>
                {/* <Heading as='h4'>Lessons</Heading>
                {(
                    lesson.lessons.length > 0
                ) ? (
                    <>
                        {lesson.lessons.map(lesson => (
                            <Link key={lesson.id} href={`/admin/courses/${lesson.id}/lessons/${lesson.id}`}>
                                    <div className='flex gap-4 border border-gray-200 rounded-lg mb-6 cursor-pointer'>
                                        <div className='py-2'>
                                            <Heading as='h5'>{lesson.name}</Heading>
                                        </div>
                                    </div>
                            </Link>
                        ))}
                    </>
                ) : (
                    <div>
                        <Heading as='h2'>None yet.</Heading>
                    </div>
                )}
                <Link href={`/admin/courses/${lesson.id}/lessons/new`}>
                    <button className="btn btn-primary">Add a lesson</button>
                </Link> */}
            </div>
        </div>
    )
}