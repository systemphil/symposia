import { getServerAuthSession } from "@/server/auth";
import { dbGetUserPurchasedCourses } from "@/server/controllers/dbController";
import Link from "next/link";

type CourseEnrollButtonProps = {
    slug: string;
}

const CourseEnrollButton = async ({ slug }: CourseEnrollButtonProps) => {
    const session = await getServerAuthSession();
    if (!session) {
        return (
            <Link href={{ pathname: '/sign-in', query: { enroll: slug } }} className='btn btn-primary'>
                Sign In to Buy
            </Link>
        );
    }

    const userCourses = await dbGetUserPurchasedCourses(session.user.id);
    if (!!userCourses && userCourses.find(course => course.slug === slug)) {
        return (
            <div className="badge badge-success">Owned</div>
        );
    }
    // TODO see stripeController for checkout function, this needs to be activated by a next action.
    return (
        <Link href={`/enroll/${slug}`} className='btn btn-primary'>
            Enroll Now
        </Link>
    );
}

export default CourseEnrollButton;