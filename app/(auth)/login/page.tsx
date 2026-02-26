"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const result = await signIn("credentials", {
            email: formData.email,
            password: formData.password,
            redirect: false,
        });

        setIsLoading(false);

        if (result?.error) {
            setError(result.error);
            return;
        }

        router.push("/jobs");
        router.refresh();
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-6">
            <div className="w-full max-w-sm">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Log in</h1>
                <p className="text-sm text-gray-500 mb-6">Welcome back to WorkNearMe.</p>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-5">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email address"
                        required
                        className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                        required
                        className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="mt-1 w-full py-2.5 rounded-full bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-medium text-sm transition-colors"
                    >
                        {isLoading ? "Logging in..." : "Log in"}
                    </button>
                </form>

                <p className="mt-5 text-sm text-center text-gray-500">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="font-medium text-green-600 hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
