import Link from "next/link";
import { dbGetCourseAndDetailsAndLessonsById } from "@/server/controllers/dbController";
import { redirect } from "next/navigation";
import Heading from "@/components/Heading";
import CourseMaterialCard from "@/components/CourseMaterialCard";
import toast from "react-hot-toast";
import { CourseForm } from "@/components/forms/CourseForm";

export default async function AdminCourseEdit({
    params,
}: {
    params: { courseId: string };
}) {
    const courseId = params.courseId;
    if (typeof courseId !== "string") {
        throw new Error("missing course id");
    }

    const course = await dbGetCourseAndDetailsAndLessonsById(courseId);

    if (!course) {
        toast.error("Oops! No course was found here!");
        console.log("No course found");
        redirect("/");
    }

    return (
        <div className="my-4 min-h-screen container">
            <Heading as="h2">{course.name}</Heading>
            <div className="grid md:grid-cols-2">
                <div>
                    <CourseForm id={courseId} />
                </div>

                <div>
                    <Heading as="h4">Course Details</Heading>
                    {course.details ? (
                        <CourseMaterialCard
                            href={`/admin/courses/${courseId}/course-details/${course.details.id}`}
                            heading="General details of the course"
                            id={course.details.id}
                            modelName="CourseDetails"
                        />
                    ) : (
                        <div>
                            <Heading as="h2">Currently no details.</Heading>
                            <Link
                                href={`/admin/courses/${courseId}/course-details/new`}
                            >
                                <button className="btn btn-primary">
                                    Add details
                                </button>
                            </Link>
                        </div>
                    )}
                    <Heading as="h4">Lessons</Heading>
                    {course.lessons.length > 0 ? (
                        <>
                            {course.lessons.map((lesson) => (
                                <CourseMaterialCard
                                    key={lesson.id}
                                    href={`/admin/courses/${course.id}/lessons/${lesson.id}`}
                                    heading={lesson.name}
                                    id={lesson.id}
                                    modelName="Lesson"
                                />
                            ))}
                        </>
                    ) : (
                        <div>
                            <Heading as="h2">None yet.</Heading>
                        </div>
                    )}
                    <Link href={`/admin/courses/${course.id}/lessons/new`}>
                        <button className="btn btn-primary">
                            Add a lesson
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
