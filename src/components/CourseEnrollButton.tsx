import { getServerAuthSession } from "@/server/auth";
import { dbGetUserPurchasedCourses } from "@/server/controllers/dbController";
import { orderCreateCheckout } from "@/server/controllers/orderController";
import Link from "next/link";
import { redirect } from "next/navigation";

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

    async function handleEnroll(priceTier: string) {
        "use server"
        const { url } = await orderCreateCheckout(slug, priceTier);
        if (!url) throw new Error("Could not create checkout session");
        redirect(url);
    }
    const handleEnrollWithBasePrice = handleEnroll.bind(null, "base");
    const handleEnrollWithSeminarPrice = handleEnroll.bind(null, "seminar");
    const handleEnrollWithDialoguePrice = handleEnroll.bind(null, "dialogue")

    return (
        <div className="flex flex-col gap-2 justify-center">
            <form action={handleEnrollWithBasePrice}>
                <button type="submit" className='btn btn-primary'>
                    Enroll base!
                </button>
            </form>
            <form action={handleEnrollWithSeminarPrice}>
                <button type="submit" className='btn btn-primary'>
                    Enroll seminar!
                </button>
            </form>
            <form action={handleEnrollWithDialoguePrice}>
                <button type="submit" className='btn btn-primary'>
                    Enroll dialogue!
                </button>
            </form>
        </div>
        
        // <Link href={`/enroll/${slug}`} className='btn btn-primary'>
        //     Enroll Now
        // </Link>
    );
}

export default CourseEnrollButton;