import Heading from "@/components/Heading"
import UserAuthForm from "@/components/UserAuthForm";
import LinkButton from "@/components/ui/LinkButton";
import { ButtonVariantEnum } from "@/config/buttonConfig";
import Link from "next/link";

const page = ({searchParams} : {searchParams : {enroll: string}}) => {
    return (
        <main className={`h-screen flex flex-col justify-front items-center gap-4`}>
            <Heading>Sign in to Symposia</Heading>
            <UserAuthForm />
            <h1 className='text-black'>Do not have an account?</h1>
            <LinkButton variant={ButtonVariantEnum.roundedBlue} props={{
                text: 'Sign Up',
                href: 'sign-up'
            }} />
        </main>
    )
}

export default page