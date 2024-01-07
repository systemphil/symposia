"use client";
/* eslint-disable @next/next/no-img-element */
import type { Course } from "@prisma/client";
import Link from 'next/link'
import Heading from './Heading'
import { useDeleteEntry } from "@/components/ContextDeleteEntry";

type CourseCardProps = {
    isAdmin: boolean;
    course: Course;
}

/**
 * Displays a Course to the UI. 
 * * NOTICE It generates distinct routes based on admin status.
 */
const CourseCard = ({ course, isAdmin }: CourseCardProps) => {
    const href = isAdmin ? `/admin/courses/${course.id}` : `/courses/${course.slug}`;
    const { deleteEntry } = useDeleteEntry();

    const handleDelete = () => {
        deleteEntry(course.id, "Course");
    }

    return (
        <>
            <div className='w-full rounded-lg bg-blue-300 transition shadow-sm hover:shadow-md'>
                <Link href={href}>
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
                </Link>
                {isAdmin && (
                    <div className="flex justify-center p-6">
                        <button className="btn btn-sm btn-error hover:bg-red-500 hover:outline-dashed hover:outline-yellow-200" onClick={() => void handleDelete()}>Delete</button>
                    </div>
                )}
            </div>
        </>
    );
};

export default CourseCard;