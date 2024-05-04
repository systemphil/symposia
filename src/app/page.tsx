import ClientErrorToasts from "@/components/ClientErrorToasts";
import Heading from "@/components/Heading";
import { PageWrapper } from "@/components/PageWrapper";
import FadeIn from "@/components/animations/FadeIn";
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
                        <Heading classes="pb-4">Discover & Reflect</Heading>
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
                <div className="flex flex-col justify-front items-center gap-4">
                    <p>Index page</p>
                    <Lorem />
                    <Lorem />
                    <Lorem />
                    <Lorem />
                    <Lorem />

                    <Lorem />
                    <ClientErrorToasts />
                </div>
            </PageWrapper>
        </>
    );
}

const Lorem = () => {
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
