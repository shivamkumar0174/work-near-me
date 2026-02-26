"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
    const { data: session, status } = useSession();
    const role = session?.user?.role;

    return (
        <nav className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200">
            <Link href="/" className="text-green-600 font-bold text-xl tracking-tight">
                WorkNearMe
            </Link>

            <div className="flex items-center gap-4 text-sm">
                <Link href="/jobs" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Browse Jobs
                </Link>

                {status === "loading" && (
                    <span className="text-gray-400">···</span>
                )}

                {status === "unauthenticated" && (
                    <>
                        <Link href="/login" className="text-gray-600 hover:text-gray-900 transition-colors">
                            Log in
                        </Link>
                        <Link
                            href="/register"
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-full font-medium transition-colors"
                        >
                            Sign up
                        </Link>
                    </>
                )}

                {status === "authenticated" && session?.user && (
                    <>
                        {role === "poster" && (
                            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">
                                Dashboard
                            </Link>
                        )}

                        <span className="text-gray-700 font-medium">
                            {session.user.name}
                        </span>

                        <button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="border border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-900 px-3 py-1.5 rounded-full transition-colors"
                        >
                            Sign out
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}
