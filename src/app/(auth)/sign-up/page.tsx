import Heading from "@/components/Heading"
import UserAuthForm from "@/components/UserAuthForm";
import LinkButton from "@/components/ui/LinkButton";
import { ButtonVariantEnum } from "@/config/buttonConfig";

const page = ({searchParams} : {searchParams : {enroll: string}}) => {
    return (
        <main className={`h-screen flex flex-col justify-front items-center gap-4`}>
            <Heading>Sign Up for Symposia</Heading>
            <UserAuthForm isSignUp={true}/>
            <h1 className='text-black'>Do you already have an account?</h1>
            <LinkButton variant={ButtonVariantEnum.roundedBlue} props={{
                text: 'Sign In',
                href: 'sign-in'
            }} />
        </main>
    )
}

export default page