"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { SKILLS } from "@/lib/constants";

function SignupForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const role = (searchParams.get("role") === "poster" ? "poster" : "seeker") as "seeker" | "poster";

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });
    const [pincode, setPincode] = useState("");
    const [location, setLocation] = useState({ city: "", state: "", pincode: "" });
    const [pincodeStatus, setPincodeStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const isSeeker = role === "seeker";

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    useEffect(() => {
        if (!isSeeker) return;
        if (pincode.length !== 6 || !/^\d{6}$/.test(pincode)) {
            setLocation({ city: "", state: "", pincode: "" });
            setPincodeStatus(pincode.length === 0 ? "idle" : "error");
            return;
        }
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
            setPincodeStatus("loading");
            try {
                const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
                const data = await res.json();
                if (data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
                    const po = data[0].PostOffice[0];
                    setLocation({ city: po.District, state: po.State, pincode });
                    setPincodeStatus("success");
                } else {
                    setLocation({ city: "", state: "", pincode: "" });
                    setPincodeStatus("error");
                }
            } catch {
                setLocation({ city: "", state: "", pincode: "" });
                setPincodeStatus("error");
            }
        }, 500);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pincode]);

    function toggleSkill(skill: string) {
        setSelectedSkills((prev) =>
            prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
        );
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const payload: Record<string, unknown> = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            role,
        };

        if (isSeeker) {
            payload.skills = selectedSkills;
            payload.location = location;
        }

        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.error || "Registration failed. Please try again.");
            setIsLoading(false);
            return;
        }

        const signInResult = await signIn("credentials", {
            email: formData.email,
            password: formData.password,
            redirect: false,
        });

        setIsLoading(false);

        if (signInResult?.error) {
            router.push("/login");
            return;
        }

        router.push(role === "poster" ? "/dashboard" : "/jobs");
        router.refresh();
    }

    const inputClass = `border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${isSeeker ? "focus:ring-green-500" : "focus:ring-blue-500"} focus:border-transparent`;

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-6 py-10">
            <div className="w-full max-w-sm">
                <Link
                    href="/register"
                    className="text-sm text-gray-400 hover:text-gray-600 transition-colors mb-6 inline-block"
                >
                    ← Change role
                </Link>

                <div className={`inline-flex items-center gap-1.5 mb-4 text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${isSeeker ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"}`}>
                    {isSeeker ? "👷 Job Seeker" : "📋 Job Poster"}
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-1">Create your account</h1>
                <p className="text-sm text-gray-500 mb-6">
                    {isSeeker
                        ? "Start finding local gigs and short-term work."
                        : "Start posting jobs and find local talent fast."}
                </p>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-5">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <div className="flex gap-3">
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="First name"
                            required
                            className={`flex-1 ${inputClass}`}
                        />
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Last name"
                            className={`flex-1 ${inputClass}`}
                        />
                    </div>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email address"
                        required
                        className={inputClass}
                    />
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password (min 6 characters)"
                        required
                        minLength={6}
                        className={inputClass}
                    />

                    {isSeeker && (
                        <>
                            <div className="border-t border-gray-100 pt-3 mt-1">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5">Location</p>
                                <div className="flex flex-col gap-2.5">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={pincode}
                                            onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                            placeholder="Enter your pincode"
                                            maxLength={6}
                                            className={`w-full ${inputClass} pr-8`}
                                        />
                                        {pincodeStatus === "loading" && (
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs animate-pulse">⏳</span>
                                        )}
                                        {pincodeStatus === "success" && (
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-sm">✓</span>
                                        )}
                                        {pincodeStatus === "error" && pincode.length === 6 && (
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400 text-sm">✕</span>
                                        )}
                                    </div>
                                    {pincodeStatus === "error" && pincode.length === 6 && (
                                        <p className="text-xs text-red-500">Pincode not found. Please check and try again.</p>
                                    )}
                                    {pincodeStatus === "success" && location.city && (
                                        <div className="flex gap-3">
                                            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700">
                                                📍 {location.city}
                                            </div>
                                            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700">
                                                {location.state}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-3">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5">
                                    Your Skills
                                    {selectedSkills.length > 0 && (
                                        <span className="ml-2 normal-case font-normal text-green-600">
                                            {selectedSkills.length} selected
                                        </span>
                                    )}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {SKILLS.map((skill) => {
                                        const isSelected = selectedSkills.includes(skill);
                                        return (
                                            <button
                                                key={skill}
                                                type="button"
                                                onClick={() => toggleSkill(skill)}
                                                className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${isSelected
                                                    ? "bg-green-600 border-green-600 text-white"
                                                    : "bg-white border-gray-300 text-gray-600 hover:border-green-400 hover:text-green-700"
                                                    }`}
                                            >
                                                {skill}
                                            </button>
                                        );
                                    })}
                                </div>
                                <p className="text-xs text-gray-400 mt-2">Tap to select the skills you offer</p>
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`mt-1 w-full py-2.5 rounded-full text-white font-medium text-sm transition-colors ${isSeeker
                            ? "bg-green-600 hover:bg-green-700 disabled:bg-green-300"
                            : "bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300"
                            }`}
                    >
                        {isLoading ? "Creating account..." : "Create account"}
                    </button>
                </form>

                <p className="mt-5 text-sm text-center text-gray-500">
                    Already have an account?{" "}
                    <Link href="/login" className={`font-medium hover:underline ${isSeeker ? "text-green-600" : "text-blue-600"}`}>
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default function SignupPage() {
    return (
        <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center text-gray-400">Loading...</div>}>
            <SignupForm />
        </Suspense>
    );
}
