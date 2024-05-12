import Image from "next/image";
import Heading from "./Heading";
import { CardShell } from "./CardShell";
import Link from "next/link";

type InfoCardProps = {
    title: string;
    text: string;
    maskType?: "diamond" | "triangle";
    imgUrl?: string;
    urlDescription?: string;
    url?: string;
};

export default async function CourseCard({
    title,
    text,
    maskType,
    imgUrl,
    urlDescription,
    url,
}: InfoCardProps) {
    return (
        <CardShell>
            {imgUrl && (
                <figure className="mt-4">
                    <Image
                        className={`mask ${
                            (maskType === "diamond" && "mask-diamond") ||
                            (maskType === "triangle" && "mask-triangle")
                        }`}
                        src={imgUrl}
                        alt="Movie"
                        width={200}
                        height={200}
                    />
                </figure>
            )}
            <div className="card-body">
                <div className="card-title justify-center">
                    <Heading as="h3">{title}</Heading>
                </div>
                <p className="text-slate-700 pt-4 text-justify">{text}</p>
                {url && urlDescription && (
                    <div className="card-actions justify-end">
                        <Link href={url}>
                            <button className="btn btn-primary">
                                {urlDescription}
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </CardShell>
    );
}
