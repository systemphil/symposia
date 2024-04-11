import Link from "next/link"

type CourseLessonContentsProps = {
    lessons: {
        slug: string;
        name: string;
    }[];
    courseSlug: string;
}

export function CourseLessonContents ({ lessons, courseSlug }: CourseLessonContentsProps) {

    if (lessons.length > 0) {
        return (
            <div>
                <ul className="flex flex-col gap-2 py-4">
                    {lessons.map((lesson: any) => {
                        return (
                            <li key={lesson.slug} className="bg-red-200 p-2 rounded-md">
                                <Link href={`/courses/${courseSlug}/${lesson.slug}`}>
                                    {lesson.name}
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </div>
        )
    }

    return <div>No lesson contents</div>
}