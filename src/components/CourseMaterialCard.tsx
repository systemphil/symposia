"use client";

import Link from "next/link"
import Heading from "./Heading"
import ButtonDeleteCross from "./ButtonDeleteCross";
import { useDeleteEntry } from "./ContextDeleteEntry";
import { type ModelName } from "@/server/controllers/coursesController";

type CourseMaterialCardProps = {
    href: string,
    heading: string,
    id: string,
    modelName: ModelName
}
/**
 * A click-able card that displays a heading and links to provided href.
 */
const CourseMaterialCard = ({ href, heading, id, modelName }: CourseMaterialCardProps) => {
    const deletion = useDeleteEntry();
    const handleDelete = () => {
        deletion.deleteEntry(id, modelName);
    }

    return(
        <div className='flex border border-gray-200 rounded-lg mb-6 hover:bg-slate-200 duration-300 justify-between items-center'>
            <Link className="flex grow" href={href}>
                <div className='flex p-2 tooltip' data-tip="Click to edit">
                    <Heading as='h3'>{heading}</Heading>
                </div>
            </Link>
             <button className="btn btn-square mr-2 hover:bg-red-500" onClick={() => void handleDelete()}><ButtonDeleteCross /></button>
        </div>
    )
}

export default CourseMaterialCard;