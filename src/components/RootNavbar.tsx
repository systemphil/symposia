"use client";

import { stylesConfig } from "@/config/stylesConfig";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";


const RootNavbar = () => {
    const { data: sessionData } = useSession();

    return (
        <header className={`${stylesConfig.nav.bgColor}`}>
            <div className="container">
                <div className="flex h-20 items-center justify-between py-6">
                    {/* Mobile Menu */}
                    <div className={`md:hidden ${stylesConfig.nav.textColor}`}>
                        <div className="dropdown dropdown-bottom dropdown-start">
                            <label tabIndex={1} className="btn btn-ghost btn-circle">
                                <div className="w-12 rounded-full">
                                    <Image src="/static/svg/menu.svg" alt="" height={25} width={25}/>
                                </div>
                            </label>
                            <ul tabIndex={1} className="menu dropdown-content z-[1] p-2 shadow bg-custom-gray w-52 rounded-sm drop-shadow-2xl text-custom-black font-semibold">
                                <li><Link href="/">Home</Link></li> 
                                <li><Link href="/admin">Admin</Link></li>
                            </ul>
                        </div>
                    </div>

                    {/* Desktop Menu */}
                    <div className={`hidden md:flex gap-6 md:gap-10 text-xl ${stylesConfig.nav.textColor} font-bold`}>
                        <Link href="/">
                            <p className="bg-custom-pink text-black text-xs rounded-full px-2">LO<br></br>GO</p>
                        </Link>
                        <Link href="/">
                            <p>Home</p>
                        </Link>
                        <Link href="/test"> {/* // TODO REMOVE WHEN FINISHED */}
                            <p className="text-red-500">Test</p>
                        </Link>
                        <Link href="/admin">
                            <p>Admin</p>
                        </Link>
                        <Link href="/courses">
                            <p>Courses</p>
                        </Link>
                    </div>

                    <nav className="flex gap-6 items-center">
                        {(
                            sessionData
                        ) ? (
                            <div className="dropdown dropdown-bottom dropdown-end">
                                <label tabIndex={0} className="btn btn-ghost btn-circle">
                                    <div className="avatar">
                                        <div className="w-12 rounded-full">
                                            {/* eslint-disable-next-line */}
                                            <img src={sessionData?.user.image ?? "/static/images/avatar_placeholder.png"} alt="avatar_picture" />
                                        </div>
                                    </div>
                                </label>
                                <ul tabIndex={0} className="menu dropdown-content z-[1] p-2 shadow bg-custom-gray rounded-box w-52 drop-shadow-2xl text-custom-black">
                                    <li><a className="pointer-events-none cursor-default opacity-75 text-lg pb-0">{sessionData && sessionData.user?.name}</a></li>
                                    <li><a className="pointer-events-none cursor-default opacity-75">{sessionData && sessionData.user?.email}</a></li>
                                    <li className="border-t my-1"></li>
                                    <li><Link href="/account">Dashboard</Link></li> 
                                    <li><Link href="/account/booking">Booking</Link></li> 
                                    <li><Link href="/account/billing">Billing</Link></li>
                                    <li className="border-t my-1"></li>
                                    <li><button onClick={() => void signOut()}>Sign Out</button></li>
                                </ul>
                            </div>
                        ) : (
                            <button
                                className="btn btn-primary"
                                onClick={() => void signIn()}
                            >
                                Sign In / Up
                            </button>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default RootNavbar;