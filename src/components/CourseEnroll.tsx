import { getServerAuthSession } from "@/server/auth";
import {
    dbGetCourseBySlug,
    dbGetUserPurchasedCourses,
} from "@/server/controllers/dbController";
import { orderCreateCheckout } from "@/server/controllers/orderController";
import { redirect } from "next/navigation";
import { SubmitButton } from "./forms/SubmitButton";
import { z } from "zod";
import { SignInButton } from "./SignInButton";
import Heading from "./Heading";

type CourseEnrollButtonProps = {
    slug: string;
};

const BASE_TIER_TITLE = "Solo Learner";
const BASE_TIER_TEXT =
    "Base tier grants access to the course and all its digital contents, including any future updates.";
const SEMINAR_TIER_TITLE = "Peer";
const SEMINAR_TIER_TEXT =
    "Seminar tier includes base tier as well as one-time access to live seminars, valid only for the season in which your course is held.";
const DIALOGUE_TIER_TITLE = "Scholar";
const DIALOGUE_TIER_TEXT =
    "Dialogue tier includes base and seminar tier as well as weekly 1:1 sessions with the teacher, valid only for the season in which your course is held. Limited slots.";

export default async function CourseEnroll({ slug }: CourseEnrollButtonProps) {
    const course = await dbGetCourseBySlug(slug);
    if (!course) {
        return <div className="badge badge-error">n/a</div>;
    }
    const seminarAvailable = course.seminarAvailability > new Date();
    const dialogueAvailable = course.dialogueAvailability > new Date();

    const session = await getServerAuthSession();

    if (session) {
        const userCourses = await dbGetUserPurchasedCourses(session.user.id);
        if (
            !!userCourses &&
            userCourses.find((course) => course.slug === slug)
        ) {
            return <div className="badge badge-success">Owned</div>;
        }
    }

    async function handleEnroll(formData: FormData) {
        "use server";
        const rawFormData = {
            rawPriceTier: formData.get("price-tier") as string,
        };
        const priceTier = z
            .enum(["base", "seminar", "dialogue"])
            .parse(rawFormData.rawPriceTier);
        const { url } = await orderCreateCheckout(slug, priceTier);
        if (!url) throw new Error("Could not create checkout session");
        redirect(url);
    }

    return (
        <div className="border w-[320px] flex flex-col justify-center items-center p-3 gap-2">
            <form
                action={handleEnroll}
                className="flex flex-col gap-2 justify-center  grow"
            >
                <p className="text-slate-800 font-bold">
                    Select your course tier
                </p>

                <div className="form-control has-[:checked]:bg-indigo-50 rounded-md">
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
                    <TierDescription
                        title={BASE_TIER_TITLE}
                        text={BASE_TIER_TEXT}
                        price={course.basePrice}
                    />
                </div>
                <div className="form-control has-[:checked]:bg-indigo-50 rounded-md">
                    <label
                        className={`label ${
                            seminarAvailable && "cursor-pointer"
                        } relative`}
                    >
                        <input
                            type="radio"
                            name="price-tier"
                            className="radio checked:bg-blue-500"
                            value="seminar"
                            disabled={!seminarAvailable}
                        />
                        {!seminarAvailable && (
                            <span className="absolute text-xs text-slate-500 top-0 right-0">
                                &nbsp;Currently unavailable
                            </span>
                        )}
                        <span
                            className={`label-text ${
                                !seminarAvailable && "line-through"
                            }`}
                        >
                            Seminar Tier
                        </span>
                    </label>
                    <TierDescription
                        title={SEMINAR_TIER_TITLE}
                        text={SEMINAR_TIER_TEXT}
                        price={course.seminarPrice}
                    />
                </div>
                <div className="form-control has-[:checked]:bg-indigo-50 rounded-md">
                    <label
                        className={`label ${
                            dialogueAvailable && "cursor-pointer"
                        } relative`}
                    >
                        <input
                            type="radio"
                            name="price-tier"
                            className="radio checked:bg-green-600"
                            value="dialogue"
                            disabled={!dialogueAvailable}
                        />
                        {!dialogueAvailable && (
                            <span className="absolute text-xs text-slate-500 top-0 right-0">
                                &nbsp;Currently unavailable
                            </span>
                        )}
                        <span
                            className={`label-text ${
                                !dialogueAvailable && "line-through"
                            }`}
                        >
                            Dialogue Tier
                        </span>
                    </label>
                    <TierDescription
                        title={DIALOGUE_TIER_TITLE}
                        text={DIALOGUE_TIER_TEXT}
                        price={course.dialoguePrice}
                    />
                </div>
                {session && <SubmitButton>Enroll!</SubmitButton>}
            </form>
            {!session && <SignInButton />}
            <p className="text-center text-sm text-slate-500">
                30-Day Money-Back Guarantee
            </p>
        </div>
    );
}

function TierDescription({
    title,
    text,
    price,
}: {
    title: string;
    text: string;
    price: number;
}) {
    return (
        <div className="flex flex-col max-w-xs items-center">
            <p className="text-5xl font-bold">
                <sup className="text-3xl font-extrabold">US</sup>${price / 100}
                <sup className="text-3xl font-semibold">00</sup>
            </p>
            <Heading as="h4" classes="text-primary">
                {title}
            </Heading>
            <p className="text-xs text-slate-600 px-2">{text}</p>
        </div>
    );
}
