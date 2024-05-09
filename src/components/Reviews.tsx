import Image from "next/image";
import { CardShell } from "./CardShell";

export function Reviews() {
    return (
        <CardShell addClasses="w-72">
            <div className="card-body">
                <div className="flex gap-3 items-center">
                    <div className="avatar">
                        <div className="w-12 rounded-full">
                            <Image
                                src="/static/images/people/filip.jpg"
                                width={96}
                                height={96}
                                alt="review avatar"
                            />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold">Filip</h3>
                    </div>
                </div>
                <div className="text-slate-600/90">
                    &quot;On the other hand, we denounce with righteous
                    indignation and dislike men who are so beguiled and
                    demoralized by the charms of pleasure of the moment, so
                    blinded by desire, that they cannot foresee the pain and
                    trouble that.&quot;
                </div>
            </div>
        </CardShell>
    );
}
