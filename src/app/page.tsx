import Heading from "@/components/Heading";
import { PageWrapper } from "@/components/PageWrapper";
import { Reviews } from "@/components/Reviews";
import FadeIn from "@/components/animations/FadeIn";
import InfoCard from "@/components/InfoCard";
import { PolyRhythmicSpiral } from "@/components/animations/PolyRhythmicSpiral";
import Link from "next/link";
import { Maintenance } from "@/components/Maintenance";
import { Suspense } from "react";
import { NewsletterEmail } from "@/components/NewsletterEmail";

export default async function Home() {
    return (
        <>
            <Hero />
            <PageWrapper>
                <OpeningDescription />
                <Suspense>
                    <Maintenance area="global" />
                </Suspense>
                <MainInfoCard />
                <InfoCards />
                <Community />
                <NewsletterSignUp />
                <VisitCourses />
                <Instructors />
                <Refunds />
                <div className="h-20" />
            </PageWrapper>
        </>
    );
}

function Hero() {
    return (
        <div className="h-[45rem] -my-36 md:my-6 w-full bg-white flex flex-col items-center justify-center overflow-hidden rounded-md ">
            <div className="absolute overflow-hidden -translate-y-5">
                <FadeIn>
                    <PolyRhythmicSpiral />
                </FadeIn>
            </div>
            <div className="translate-y-2 md:translate-y-1 lg:-translate-y-1 flex flex-col items-center justify-center">
                <div className="font-bold text-center relative z-20 bg-clip-text tracking-widest text-transparent">
                    <Heading replacementClasses="pb-4 text-transparent bg-gradient-to-b from-black/80 to-black dark:from-white dark:to-[#AAAAAA]">
                        Discover & Reflect
                    </Heading>
                </div>
                <h3 className="text-xl my-1.5 md:text-2xl lg:text-3xl text-stone-600 font-light inter-var text-center">
                    In-depth learning courses on philosophy
                </h3>
                <div className="w-[40rem] h-40 relative">
                    {/* Gradients */}
                    <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-purple-400 to-transparent h-[2px] w-3/4 blur-sm" />
                    <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-purple-400 to-transparent h-px w-3/4" />
                    <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-pink-400 to-transparent h-[5px] w-1/4 blur-sm" />
                    <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-pink-400 to-transparent h-px w-1/4" />
                </div>
            </div>
        </div>
    );
}

function OpeningDescription() {
    return (
        <FadeIn>
            <Heading as="h3" additionalClasses="max-w-xl">
                <span className="text-[#6b0072]">Symposia</span> is a philosophy
                course platform that offers on-demand digital courses, live
                university-grade seminars, and personalized tuition.
            </Heading>
        </FadeIn>
    );
}

function MainInfoCard() {
    return (
        <FadeIn>
            <div className="md:px-10 max-w-[900px] mt-10 md:mt-32">
                <InfoCard
                    title="Why Symposia"
                    text="We dream of a way of doing philosophy that is intense, life-long and free. To be able to rigorously engage with concepts and ideas to their utmost depth without sacrificing either scholarly quality or creativity.. To be able to pursue and hone one's philosophical craft and enjoyment in a way that supports and enriches everyday living. And finally to be thinking deeply about contents of philosophy purely for their own sake. Symposia exists as a companion to sPhil, a collaborative encyclopedia inspired by systematic philosophers and modern open source principles. Symposia is intended to be an additional guide into the philosophical resources we otherwise make freely available at sPhil. Whether you are a novice or a professional, our courses welcome anyone who has a burning desire to examine, philosophically, the wonders of being."
                    imgUrl="/static/images/fire.webp"
                    maskType="triangle"
                    url="https://sphil.xyz"
                    urlDescription="Visit sPhil"
                />
            </div>
        </FadeIn>
    );
}

function InfoCards() {
    return (
        <FadeIn>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full mt-10 md:mt-32">
                <InfoCard
                    title="Deepen Your Thinking: Explore Philosophy In-Depth"
                    text="Dive into the world's greatest ideas with our comprehensive online philosophy courses. Go beyond introductory lectures and engage with challenging concepts in a supportive learning environment."
                    maskType="diamond"
                    imgUrl="/static/images/sun.webp"
                />
                <InfoCard
                    title="Choose Your Learning Style: Digital, with Seminars, or 1-on-1 Dialogue"
                    text="We offer a variety of learning formats to suit your ambition. Take courses entirely on-demand with digital content at your own pace, participate in live interactive seminars with fellow peers, or get personalized guidance with private sessions from our instructors."
                    maskType="diamond"
                    imgUrl="/static/images/discussion.webp"
                />
                <InfoCard
                    title="Focus on Text: Meet the Greatest Minds of History"
                    text="Gain insights from renowned philosophers by meeting them on their own ground, namely, their text! Our courses center around primary texts supplemented by secondary literature. We think it is important that you spend time with the philosopher's own text and become equipped to make up your own mind regarding their ideas."
                    maskType="diamond"
                    imgUrl="/static/images/books.webp"
                />
                <InfoCard
                    title="Sharpen Your Critical Thinking: Unleash Your Philosophical Potential"
                    text="They who do not understand the past cannot comprehend the future. Philsophy is not about the past but the discovery of futures. Learn to think critically, analyze arguments, and form your own well-reasoned opinions - skills valuable in all aspects of life."
                    maskType="diamond"
                    imgUrl="/static/images/eye.webp"
                />
            </div>
        </FadeIn>
    );
}

function Community() {
    return (
        <>
            <Heading as="h3" additionalClasses="max-w-lg mt-10 md:mt-32">
                Join the <span className="text-[#6b0072]">community</span>
            </Heading>
            <p className="text-lg text-slate-500 py-2">
                What do our students say about our courses and instructors?
            </p>
            <Reviews />
        </>
    );
}

function NewsletterSignUp() {
    return (
        <>
            <Heading as="h3" additionalClasses="max-w-lg mt-10 md:mt-32">
                Stay up-to-date with our{" "}
                <span className="text-[#6b0072]">newsletter</span>
            </Heading>
            <p className="text-lg text-slate-500 py-2">
                Sign up to receive updates on new courses, seminars, and other
                events.
            </p>
            <NewsletterEmail />
        </>
    );
}

function VisitCourses() {
    return (
        <>
            <Heading as="h3" additionalClasses="max-w-xl mt-10 md:mt-32">
                Look through the eyes of{" "}
                <span className="text-[#6b0072]">millenia</span>
            </Heading>
            <p className="text-lg text-slate-500 py-4">
                Discover and partake in philosophical discourses that stretches
                beyond empires, generations and time.
            </p>
            <Link href="/courses">
                <button className="btn btn-primary">See our courses</button>
            </Link>
        </>
    );
}

function Instructors() {
    return (
        <>
            <Heading as="h3" additionalClasses="max-w-lg mt-10 md:mt-32">
                Meet the <span className="text-[#6b0072]">instructors</span>
            </Heading>
            <p className="text-lg text-slate-500 py-2">
                Here you can find brief information about our teacher&apos;s
                interests and qualifications.
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
                <InfoCard
                    title="Filip Niklas, PhD"
                    text="Filip completed his PhD in philosophy in 2022 under the supervision of Professor Stephen Houlgate at the University of Warwick. The title of his thesis was Hegel's <em>Critique of Determinism: Justifying Unfreedom as a Moment of Freedom</em>. Filip has given papers and organized numerous conferences on philosophy. He has taught extensively both at universiy, at the Halkyon Academy and privately. Filip's main research areas are systematic philosophy, metaphysics, ontology, essence, freedom, determinism, and maintains an otherwise broad interest in all the dimensions of intelligence and reason. Filip is also an incurable fan of the art and poetry of William Blake."
                    maskType="squircle"
                    imgUrl="/static/images/people/filip.jpg"
                />
                <InfoCard
                    title="Ahilleas Rokni, PhD"
                    text="Ahilleas Rokni completed his PhD thesis in philosophy in 2022 under the supervision of Professor Stephen Houlgate at the University of Warwick. His thesis aimed to give an account of the much-debated move from the Science of Logic to the Philosophy of Nature in Hegel's system. Ahilleas's main research concerns are Hegel's logic, philosophy of nature, philosophy of science, and aesthetics."
                    maskType="squircle"
                    imgUrl="/static/images/people/ahilleas.jpg"
                />
            </div>
        </>
    );
}

function Refunds() {
    return (
        <>
            <Heading as="h3" additionalClasses="max-w-xl mt-10 md:mt-32">
                Tried it, not for you,{" "}
                <span className="text-[#6b0072]">changed</span> your mind?
            </Heading>
            <p className="text-lg text-slate-500 py-4">
                If you find that a particular course wasn&apos;t for you, we
                offer full refunds up until 30-days after purchase.
            </p>
        </>
    );
}
