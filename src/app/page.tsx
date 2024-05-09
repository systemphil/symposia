import Heading from "@/components/Heading";
import { PageWrapper } from "@/components/PageWrapper";
import { Reviews } from "@/components/Reviews";
import FadeIn from "@/components/animations/FadeIn";
import InfoCard from "@/components/InfoCard";
import { PolyRhythmicSpiral } from "@/components/animations/PolyRhythmicSpiral";

export default async function Home() {
    return (
        <>
            <div className="h-[45rem] -my-36 md:my-6 w-full bg-white flex flex-col items-center justify-center overflow-hidden rounded-md ">
                <div className="absolute overflow-hidden -translate-y-5">
                    <FadeIn>
                        <PolyRhythmicSpiral />
                    </FadeIn>
                </div>
                <div className="translate-y-2 md:translate-y-1 lg:-translate-y-1 flex flex-col items-center justify-center">
                    <div className="font-bold text-center relative z-20 bg-clip-text tracking-widest text-transparent">
                        <Heading classes="pb-4 text-transparent bg-gradient-to-b from-black/80 to-black dark:from-white dark:to-[#AAAAAA]">
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
            <PageWrapper>
                <FadeIn>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full py-10">
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
                <div className="flex flex-col justify-front items-center gap-4">
                    <Reviews />
                    <LoremExample />
                    <LoremExample />
                    <LoremExample />
                    <LoremExample />
                    <LoremExample />
                    <LoremExample />
                </div>
            </PageWrapper>
        </>
    );
}

const LoremExample = () => {
    return (
        <p>
            On the other hand, we denounce with righteous indignation and
            dislike men who are so beguiled and demoralized by the charms of
            pleasure of the moment, so blinded by desire, that they cannot
            foresee the pain and trouble that are bound to ensue; and equal
            blame belongs to those who fail in their duty through weakness of
            will, which is the same as saying through shrinking from toil and
            pain. These cases are perfectly simple and easy to distinguish. In a
            free hour, when our power of choice is untrammelled and when nothing
            prevents our being able to do what we like best, every pleasure is
            to be welcomed and every pain avoided. But in certain circumstances
            and owing to the claims of duty or the obligations of business it
            will frequently occur that pleasures have to be repudiated and
            annoyances accepted. The wise man therefore always holds in these
            matters to this principle of selection: he rejects pleasures to
            secure other greater pleasures, or else he endures pains to avoid
            worse pains.
        </p>
    );
};
