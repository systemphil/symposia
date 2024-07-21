"use client";

import { apiClientside } from "@/lib/trpc/trpcClientside";
import { CardShell } from "./CardShell";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

export const NewsletterEmail = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data: any) => {
        try {
            await mutation.mutateAsync({ email: data.email });
            toast.success("Subscribed!");
        } catch (error) {
            toast.error("E-mail may already be subscribed");
        }
    };

    const mutation = apiClientside.db.createNewsletterEmailEntry.useMutation();

    return (
        <div className="card py-2">
            <CardShell>
                <div className="p-10">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex justify-center"
                    >
                        <div className="form-group">
                            <input
                                disabled={
                                    mutation.isLoading || mutation.isSuccess
                                }
                                placeholder={
                                    (mutation.isIdle && "Enter your email") ||
                                    (mutation.isSuccess && "Thank you!") ||
                                    ""
                                }
                                id="email"
                                type="email"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: "Enter a valid email address",
                                    },
                                })}
                                className="p-2 border border-gray-400 rounded-l-md"
                            />
                        </div>
                        <button
                            disabled={mutation.isLoading || mutation.isSuccess}
                            type="submit"
                            className={`
                                ${
                                    mutation.isError
                                        ? "bg-red-500"
                                        : "bg-blue-500"
                                }
                                w-32
                               text-white p-2 rounded-r-md`}
                        >
                            {mutation.isError && "Error. Retry"}
                            {mutation.isIdle && "Subscribe"}
                            {mutation.isLoading && "Subscribing..."}
                            {mutation.isSuccess && "Subscribed!"}
                        </button>
                    </form>
                    <div className="h-3 p-1 flex justify-center">
                        {errors.email && (
                            <p className="error-message text-red-400">
                                {errors.email.message?.toString()}
                            </p>
                        )}
                        {mutation.isSuccess && (
                            <p className="success-message text-green-600 text-center">
                                Thank you for subscribing! 🦉
                            </p>
                        )}
                    </div>
                </div>
            </CardShell>
        </div>
    );
};
