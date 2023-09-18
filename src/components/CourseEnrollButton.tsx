"use client";

import { useSession } from "next-auth/react";
import LinkButton from "./ui/LinkButton";
import { ButtonVariantEnum } from "@/config/buttonConfig";

type CourseEnrollButtonProps = {
    slug: string
}

const CourseEnrollButton = ({ slug } : CourseEnrollButtonProps) => {
    const { data: sessionData } = useSession();

    return (
        <LinkButton variant={ButtonVariantEnum.roundedBlue} props={
            (sessionData) ? ({
                text: 'Enroll',
                href: `/enroll/${slug}`
            }) : ({
                text: 'Sign In to Enroll',
                href: {
                    pathname: '/sign-in', 
                    query: { enroll: slug }
                }
            })
        }/>
    )
}

export default CourseEnrollButton;