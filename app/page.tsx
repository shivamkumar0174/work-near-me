import Link from "next/link";
import { JOB_CATEGORIES } from "@/lib/constants";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-20 pb-16 text-center">
        <p className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-4">
          Local Gigs & Short-Term Work
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight mb-5">
          Find work or hire someone —<br />
          <span className="text-green-600">right in your city.</span>
        </h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto mb-8">
          WorkNearMe connects people who need small jobs done with local people ready to do them.
          No long-term contracts. No agencies. Just quick, local work.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            href="/jobs"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-full font-medium transition-colors"
          >
            Browse Jobs
          </Link>
          <Link
            href="/register"
            className="border border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-2.5 rounded-full font-medium transition-colors"
          >
            Post a Job
          </Link>
        </div>
      </section>

      {/* What kind of work */}
      <section className="border-t border-gray-100 bg-gray-50 py-14 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-lg font-semibold text-center text-gray-700 mb-6">
            What kind of work is posted here?
          </h2>
          <div className="flex flex-wrap justify-center gap-2">
            {JOB_CATEGORIES.filter(c => c !== "Other").map((cat) => (
              <Link
                key={cat}
                href={`/jobs?category=${cat}`}
                className="bg-white border border-gray-200 hover:border-green-400 hover:text-green-700 text-gray-600 text-sm px-4 py-1.5 rounded-full transition-colors"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">How it works</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Seeker */}
            <div className="border border-gray-200 rounded-xl p-6">
              <p className="text-green-600 font-bold text-sm uppercase tracking-wide mb-3">Looking for work?</p>
              <ol className="space-y-2 text-gray-600 text-sm list-decimal list-inside">
                <li>Create a free seeker account</li>
                <li>Browse jobs posted in your city</li>
                <li>Apply with a short message</li>
                <li>Get hired and get paid</li>
              </ol>
              <Link href="/register" className="mt-5 inline-block text-green-600 font-medium text-sm hover:underline">
                Sign up as a seeker →
              </Link>
            </div>
            {/* Poster */}
            <div className="border border-gray-200 rounded-xl p-6">
              <p className="text-blue-600 font-bold text-sm uppercase tracking-wide mb-3">Need someone hired?</p>
              <ol className="space-y-2 text-gray-600 text-sm list-decimal list-inside">
                <li>Create a free poster account</li>
                <li>Post the job with your budget</li>
                <li>Review applicants</li>
                <li>Hire the right person</li>
              </ol>
              <Link href="/register" className="mt-5 inline-block text-blue-600 font-medium text-sm hover:underline">
                Sign up as a poster →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-gray-100 bg-gray-50 py-12 px-6 text-center">
        <h2 className="text-xl font-bold mb-2">Ready to get started?</h2>
        <p className="text-gray-500 text-sm mb-6">Free to join. No hidden fees.</p>
        <Link
          href="/register"
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-2.5 rounded-full font-medium transition-colors"
        >
          Create a free account
        </Link>
      </section>

    </div>
  );
}