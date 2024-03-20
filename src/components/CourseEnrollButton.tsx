import { getServerAuthSession } from "@/server/auth";
import { dbGetCourseBySlug, dbGetUserPurchasedCourses } from "@/server/controllers/dbController";
import { orderCreateCheckout } from "@/server/controllers/orderController";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SubmitButton } from "./forms/SubmitButton";
import { z } from "zod";

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

    async function handleEnroll(formData: FormData) {
        "use server";
        const rawFormData = {
            rawPriceTier: formData.get('price-tier') as string,
        }
        const priceTier = z.enum(["base", "seminar", "dialogue"]).parse(rawFormData.rawPriceTier);
        const { url } = await orderCreateCheckout(slug, priceTier);
        if (!url) throw new Error("Could not create checkout session");
        redirect(url);
    }

    const course = await dbGetCourseBySlug(slug);
    if (!course) {
        return (
            <div className="badge badge-error">n/a</div>
        );
    }

    const seminarAvailable = course.seminarAvailability > new Date();
    const dialogueAvailable = course.dialogueAvailability > new Date();

    return (
        <form action={handleEnroll} className="flex flex-col gap-2 justify-center">
            <p className="text-slate-800">Select your course tier</p>
            <div className="form-control">
                <label className="label cursor-pointer gap-16 flex">
                    <input
                        type="radio" 
                        name="price-tier" 
                        className="radio checked:bg-red-500" 
                        defaultChecked
                        value="base"
                    />
                    <span className="label-text">Base Tier</span> 
                </label>
            </div>
            <div className="form-control">
                <label className={`label ${seminarAvailable && "cursor-pointer"}`}>
                    <input 
                        type="radio" 
                        name="price-tier" 
                        className="radio checked:bg-blue-500"
                        value="seminar"
                        disabled={!seminarAvailable}
                    />
                    <span className="label-text">
                        Seminar Tier
                        {!seminarAvailable &&
                        <span className="absolute text-xs text-slate-500">&nbsp;Currently unavailable</span>}
                    </span>
                </label>
            </div>
            <div className="form-control">
                <label className={`label ${dialogueAvailable && "cursor-pointer"}`}>
                    <input 
                        type="radio" 
                        name="price-tier" 
                        className="radio checked:bg-green-500"
                        value="dialogue"
                        disabled={!dialogueAvailable}
                    />
                    <span className="label-text">
                        Dialogue Tier
                        {!dialogueAvailable &&
                        <span className="absolute text-xs text-slate-500">&nbsp;Currently unavailable</span>}
                    </span> 
                </label>
            </div>
            <SubmitButton>
                Enroll!
            </SubmitButton>
        </form>
    );
}

export default CourseEnrollButton;