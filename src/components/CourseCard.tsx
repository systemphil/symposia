import type { Course } from "@prisma/client";
import Link from 'next/link';
import Heading from './Heading';
import Image from "next/image";

type CourseCardProps = {
    course: Course;
}

export default async function CourseCard ({ course }: CourseCardProps) {
    const href = `/courses/${course.slug}`;

    return (
        <div className='w-full rounded-lg bg-blue-300 transition shadow-sm hover:shadow-md'>
            <Link href={href}>
                {course.imageUrl && (
                    <Image
                        className="w-full rounded-t-lg"
                        src={course.imageUrl}
                        alt={`Video thumbnail preview for ${course.name}`}
                        width={340}
                        height={240}
                    />
                )}

                <div className="p-8">
                    {!course.published && 
                    (<span className="bg-slate-200 text-slate-700 rounded-full text-xs py-1 px-3 mb-2 inline-block">Draft</span>)}
                    <Heading as="h3">{course.name}</Heading>
                    <p className="text-slate-700">{course.description}</p>
                </div>
            </Link>
        </div>
    );
};
