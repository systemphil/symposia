import { getServerAuthSession } from "@/server/auth";
import Link from "next/link";

type CourseEnrollButtonProps = {
    slug: string
}

const CourseEnrollButton = async ({ slug }: CourseEnrollButtonProps) => {
    const session = await getServerAuthSession();

    return ((session) ? (
        <Link href={`/enroll/${slug}`} className='btn btn-primary'>
            Enroll
        </Link>
    ) : (
        <Link href={{ pathname: '/sign-in', query: { enroll: slug } }} className='btn btn-primary'>
            Sign In to Enroll
        </Link>
    ))
}

export default CourseEnrollButton;