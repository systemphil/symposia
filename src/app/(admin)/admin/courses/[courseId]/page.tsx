import Link from 'next/link'
import { dbGetCourseAndLessonsById } from '@/server/controllers/coursesController';
import { redirect } from "next/navigation";
import Heading from '@/components/Heading';
import AdminCourseFormContainer from '@/components/AdminCourseFormContainer'
import CourseMaterialCard from '@/components/CourseMaterialCard';


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
                            <CourseMaterialCard 
                                key={lesson.id} 
                                href={`/admin/courses/${course.id}/lessons/${lesson.id}`} 
                                heading={lesson.name} 
                            />
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