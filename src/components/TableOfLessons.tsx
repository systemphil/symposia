import Link from "next/link";
import Heading from "./Heading";
import { romanize } from "@/utils/utils";

type CourseLessonContentsProps = {
    lessons: {
        slug: string;
        name: string;
    }[];
    courseSlug: string;
};

export function TableOfLessons({
    lessons,
    courseSlug,
}: CourseLessonContentsProps) {
    if (lessons.length > 0) {
        return (
            <div className="mt-4 md:py-8 bg-slate-100/90 w-[320px]">
                <Heading as="h3">Lessons</Heading>
                <ul className="menu max-w-xs">
                    {lessons.map((lesson: any, index) => {
                        return (
                            <li key={lesson.slug}>
                                <Link
                                    href={`/courses/${courseSlug}/${lesson.slug}`}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="w-5 h-5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                                        />
                                    </svg>
                                    {`${romanize(index + 1)}. ${lesson.name}`}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    }

    return <div>No lesson contents</div>;
}
