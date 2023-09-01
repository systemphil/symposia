import Link from "next/link"
import Heading from "./Heading"

/**
 * A click-able card that displays a heading and links to provided href. Optional key parameter for loop iteration. 
 */
const CourseMaterialCard = ({ href, heading, key}: { href: string, heading: string, key?: string}) => {
    return(
        <Link key={key} href={href}>
            <div className='flex gap-4 border border-gray-200 rounded-lg mb-6 cursor-pointer hover:bg-slate-200 duration-300 tooltip' data-tip="Click to edit">
                <div className='flex p-2'>
                    <Heading as='h3'>{heading}</Heading>
                </div>
            </div>
        </Link>
    )
}

export default CourseMaterialCard;