import Heading from "@/components/Heading"
import UserAuthForm from "@/components/UserAuthForm";
import Link from "next/link";

const page = ({ searchParams }: { searchParams: { enroll: string } }) => {
    return (
        <main className={`h-screen flex flex-col justify-front items-center gap-4`}>
            <Heading>Sign In to Symposia</Heading>
            <UserAuthForm isSignUp={false} />
            <h1 className='text-black'>Do not have an account?</h1>
            <Link href='sign-up' className='btn btn-secondary'>
                <p>Sign Up</p>
            </Link>
        </main>
    )
}

export default page