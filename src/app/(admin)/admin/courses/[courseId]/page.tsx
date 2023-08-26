import Link from 'next/link'
import { dbGetCourseAndLessonsById } from '@/server/controllers/courses';
import { redirect } from "next/navigation";
import Heading from '@/components/Heading';
import AdminCourseFormContainer from '@/components/AdminCourseFormContainer'


export default async function AdminCourseEdit ({ params }: { params: { courseId: string }}) {
    const id = params.courseId;
    if (typeof id !== "string") { throw new Error('missing course id') };

    const course = await dbGetCourseAndLessonsById(id);

    if (!course) {
        console.log("No course found");
        redirect("/");
    }

    return (
        <div className='grid md:grid-cols-2'>
            <div>
                <Heading as='h2'>{course.name}</Heading>
                <AdminCourseFormContainer initialCourse={course} id={id}/>
            </div>

            <div>
                <Heading as='h4'>Lessons</Heading>
                {(
                    course.lessons.length > 0
                ) ? (
                    <>
                        {course.lessons.map(lesson => (
                            <Link key={lesson.id} href={`/admin/courses/${course.id}/lessons/${lesson.id}`}>
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
                <Link href={`/admin/courses/${course.id}/lessons/new`}>
                    <button className="btn btn-primary">Add a lesson</button>
                </Link>
            </div>
        </div>
    )
}