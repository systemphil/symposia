import Heading from "@/components/Heading"
import UserAuthForm from "@/components/UserAuthForm";
import Link from "next/link";

const page = ({ searchParams }: { searchParams: { enroll: string } }) => {
    return (
        <main className={`h-screen flex flex-col justify-front items-center gap-4`}>
            <Heading>Sign Up for Symposia</Heading>
            <UserAuthForm isSignUp={true} />
            <h1 className='text-black'>Do you already have an account?</h1>
            <Link href='sign-in' className='btn btn-secondary'>
                Sign In
            </Link>
        </main>
    )
}

export default page