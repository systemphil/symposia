"use client";

import { Session } from "next-auth";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { LogoBrandAnimated } from "./LogoBrandAnimated";
import LogoOwl from "./LogoOwl";
import cn from "classnames";

const TEXT_COLOR = "text-slate-500 dark:text-slate-100";

export const RootNavbar = () => {
    const { data: sessionData } = useSession();

    return (
        <header
            className={`sticky top-0 z-30 print:hidden bg-transparent ${TEXT_COLOR}`}
        >
            <div className="'pointer-events-none absolute z-[-1] h-full w-full backdrop-blur-md bg-white/[.85] dark:!bg-slate-900/80 shadow-[0_2px_4px_rgba(0,0,0,.02),0_1px_0_rgba(0,0,0,.06)] dark:shadow-[0_-1px_0_rgba(255,255,255,.1)_inset] contrast-more:shadow-[0_0_0_1px_#000] contrast-more:dark:shadow-[0_0_0_1px_#fff]"></div>
            <div className="container ">
                <div className="flex h-[64px] items-center justify-between py-6">
                    {/* 
                        MOBILE MENU
                    */}
                    <div className={`md:hidden`}>
                        <div className="dropdown dropdown-bottom dropdown-start">
                            <label
                                tabIndex={1}
                                className="btn btn-ghost btn-circle"
                            >
                                <div className="rounded-full">
                                    <Image
                                        src="/static/svg/menu.svg"
                                        alt=""
                                        height={25}
                                        width={25}
                                    />
                                </div>
                            </label>
                            <ul
                                tabIndex={1}
                                className="menu dropdown-content z-[1] p-2 shadow bg-white w-52 rounded-md drop-shadow-2xl"
                            >
                                <li>
                                    <Link href="/">Home</Link>
                                </li>
                                <li>
                                    <Link href="/">Courses</Link>
                                </li>
                                {sessionData &&
                                    sessionData.user.role === "ADMIN" && (
                                        <>
                                            <li className="border-t my-1" />
                                            <li>
                                                <Link
                                                    href="/admin"
                                                    className="text-purple-700"
                                                >
                                                    Admin
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href="/test"
                                                    className="text-red-500"
                                                >
                                                    Test
                                                </Link>
                                            </li>
                                        </>
                                    )}
                            </ul>
                        </div>
                    </div>

                    {/* 
                        DESKTOP MENU
                    */}
                    <div className={`hidden md:flex gap-6 md:gap-10 text-md`}>
                        <Link
                            href="/"
                            className="flex items-center gap-4 relative"
                        >
                            <LogoOwl />
                            <LogoBrandAnimated />
                            <div className="badge badge-sm badge-ghost absolute -right-4 -bottom-3 bg-pink-200 /75">
                                Beta
                            </div>
                        </Link>
                        <NavBarLinkDesktop href="/" text="Home" />
                        <NavBarLinkDesktop href="/courses" text="Courses" />
                        {sessionData && sessionData.user.role === "ADMIN" && (
                            <>
                                <span className="text-purple-700">
                                    <NavBarLinkDesktop
                                        href="/admin"
                                        text="Admin"
                                    />
                                </span>
                                <span className="text-red-500">
                                    <NavBarLinkDesktop
                                        href="/test"
                                        text="Test"
                                    />
                                </span>
                            </>
                        )}
                    </div>

                    <nav className="flex gap-6 items-center">
                        {sessionData ? (
                            <UserMenu sessionData={sessionData} />
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

const NavBarLinkDesktop = ({ href, text }: { href: string; text: string }) => {
    const hoverUnderline =
        "after:bg-slate-700 after:absolute after:h-[2px] after:w-0 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300";
    const classes =
        "py-1 transition-colors duration-300 cursor-pointer hover:text-black dark:hover:text-white";

    return (
        <Link href={href} className="relative">
            <p className={`${cn(hoverUnderline, classes)}`}>{text}</p>
        </Link>
    );
};
const UserMenu = ({ sessionData }: { sessionData: Session }) => {
    return (
        <div className="dropdown dropdown-bottom dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
                <div className="avatar">
                    <div className="w-12 rounded-full">
                        {/* eslint-disable-next-line */}
                        <img
                            src={
                                sessionData?.user.image ??
                                "/static/images/avatar_placeholder.png"
                            }
                            alt="avatar_picture"
                        />
                    </div>
                </div>
            </label>
            <ul
                tabIndex={0}
                className="menu dropdown-content z-[1] p-2 shadow bg-white rounded-box w-52 drop-shadow-2xl"
            >
                <li>
                    <a className="pointer-events-none cursor-default opacity-75 text-lg pb-0">
                        {sessionData && sessionData.user?.name}
                    </a>
                </li>
                <li>
                    <a className="pointer-events-none cursor-default opacity-75">
                        {sessionData && sessionData.user?.email}
                    </a>
                </li>
                {sessionData && sessionData.user.provider && (
                    <li>
                        <a className="pointer-events-none cursor-default opacity-75">
                            Logged in with {sessionData.user.provider}
                        </a>
                    </li>
                )}
                <li className="border-t my-1" />
                <li>
                    <Link href="/account/billing">Billing</Link>
                </li>
                <li className="border-t my-1" />
                <li>
                    <button onClick={() => void signOut()}>Sign Out</button>
                </li>
            </ul>
        </div>
    );
};
