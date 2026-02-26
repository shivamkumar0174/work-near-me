import Link from "next/link";

export default function RolePicker() {
    return (
        <div className="min-h-[80vh] bg-white flex flex-col items-center justify-center px-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Join WorkNearMe</h1>
            <p className="text-gray-500 mb-10">What brings you here?</p>

            <div className="grid sm:grid-cols-2 gap-5 w-full max-w-xl">
                {/* Seeker card */}
                <Link
                    href="/register/signup?role=seeker"
                    className="group border border-gray-200 hover:border-green-500 rounded-2xl p-7 transition-all hover:shadow-md text-left"
                >
                    <div className="text-3xl mb-3">👷</div>
                    <h2 className="text-lg font-semibold text-gray-900 group-hover:text-green-700 mb-1">
                        I&apos;m looking for work
                    </h2>
                    <p className="text-sm text-gray-500">
                        Browse local gigs, apply for jobs, and get hired for short-term work near you.
                    </p>
                    <span className="mt-4 inline-block text-sm font-medium text-green-600 group-hover:underline">
                        Sign up as seeker →
                    </span>
                </Link>

                {/* Poster card */}
                <Link
                    href="/register/signup?role=poster"
                    className="group border border-gray-200 hover:border-blue-500 rounded-2xl p-7 transition-all hover:shadow-md text-left"
                >
                    <div className="text-3xl mb-3">📋</div>
                    <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 mb-1">
                        I need to hire someone
                    </h2>
                    <p className="text-sm text-gray-500">
                        Post a job, set your budget, and find local people available right away.
                    </p>
                    <span className="mt-4 inline-block text-sm font-medium text-blue-600 group-hover:underline">
                        Sign up as poster →
                    </span>
                </Link>
            </div>

            <p className="mt-8 text-sm text-gray-500">
                Already have an account?{" "}
                <Link href="/login" className="text-green-600 hover:underline font-medium">
                    Log in
                </Link>
            </p>
        </div>
    );
}
