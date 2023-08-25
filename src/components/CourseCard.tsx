import type { Course } from "@prisma/client";
import Link from 'next/link'
import Heading from './Heading'

type CourseCardProps = {
    isAdmin: boolean;
    course: Course;
}

/**
 * Displays a Course to the UI. 
 * * NOTICE It generates distinct routes based on admin status.
 */
const CourseCard = ({ course, isAdmin }: CourseCardProps) => {
    const href = isAdmin ? `/admin/courses/${course.id}` : `/courses/${course.slug}`
    return (
        <>
            <Link href={href}>
                <div className='w-full border rounded-lg transition shadow-sm hover:shadow-md cursor-pointer'>
                    {course.imageUrl && (
                        <img
                            className="w-full rounded-t-lg"
                            src={course.imageUrl}
                            alt={`Video thumbnail preview for ${course.name}`}
                            width={320}
                            height={240}
                        />
                    )}

                    <div className="p-8">
                        {!course.published && (<span className="bg-slate-200 text-slate-700 rounded-full text-xs py-1 px-3 mb-2 inline-block">Draft</span>)}
                        <Heading as="h3">{course.name}</Heading>
                        <p className="text-slate-700">{course.description}</p>
                    </div>
                </div>
            </Link>
        </>
    );
};

export default CourseCard;