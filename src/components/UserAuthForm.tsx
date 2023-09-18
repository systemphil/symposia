"use client"

import React from "react";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { ButtonVariantEnum } from "@/config/buttonConfig";
import FunctionButton from "./ui/FunctionButton";

const UserAuthForm = ({ isSignUp } : { isSignUp: boolean }) => {
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const loginWithGoogle = async () => {
        setIsLoading(true);

        try {
            await signIn('google');
        } catch (error) {
            toast.error('There was an error logging in using Google');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className='container flex flex-col justify-front items-center gap-4'>
            <div className='flex flex-col space-y-2 text-center'>
                <h1 style={{color: 'black'}}>{
                    isSignUp ? 'Get started' : 'Welcome back'
                }</h1>
            </div>
            <FunctionButton variant={ButtonVariantEnum.roundedBlue} props={{
                text: 'Google',
                onClick: loginWithGoogle
            }} />
        </div>
    )
}

export default UserAuthForm