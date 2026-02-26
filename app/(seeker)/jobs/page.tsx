import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import { Suspense } from "react";
import { connectDB } from "@/lib/db";
import Job from "@/lib/models/Job";

export const dynamic = "force-dynamic";

export default async function JobsPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; category?: string; type?: string }>;
}) {
    const { q, category, type } = await searchParams;

    await connectDB();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = { status: "open" };

    if (q) {
        filter.$or = [
            { title: { $regex: q, $options: "i" } },
            { "location.city": { $regex: q, $options: "i" } },
            { description: { $regex: q, $options: "i" } },
        ];
    }
    if (category) {
        filter.category = { $in: [category] };
    }
    if (type) {
        filter.type = type;
    }

    const jobs = await Job.find(filter).sort({ createdAt: -1 }).lean();

    return (
        <div style={{ fontFamily: "sans-serif", maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
            <Link href="/">← Back to Home</Link>
            <h1 style={{ marginTop: "1rem" }}>🔍 Browse Jobs</h1>
            <p style={{ color: "#555" }}>Find local work near you.</p>

            <Suspense fallback={<div>Loading search...</div>}>
                <SearchBar />
            </Suspense>

            {q && (
                <p style={{ marginTop: "1rem", color: "#0070f3" }}>
                    Showing results for: <strong>&quot;{q}&quot;</strong>{" "}
                    <Link href="/jobs" style={{ color: "#888", fontSize: "0.9rem" }}>(clear)</Link>
                </p>
            )}

            <p style={{ color: "#888", fontSize: "0.9rem", marginTop: "0.5rem" }}>
                {jobs.length} job{jobs.length !== 1 ? "s" : ""} found
            </p>

            {jobs.length === 0 ? (
                <div style={{ marginTop: "2rem", textAlign: "center", padding: "3rem", border: "1px dashed #ccc", borderRadius: "8px" }}>
                    {q ? (
                        <>
                            <p style={{ fontSize: "1.2rem" }}>😕 No jobs found for &quot;{q}&quot;</p>
                            <Link href="/jobs">Browse all jobs</Link>
                        </>
                    ) : (
                        <>
                            <p style={{ fontSize: "1.2rem" }}>📭 No jobs posted yet</p>
                            <Link href="/post-job">Be the first to post a job!</Link>
                        </>
                    )}
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1.5rem" }}>
                    {jobs.map((job) => {
                        const spotsLeft = (job.openings ?? 1) - (job.hiredCount ?? 0);
                        const isRemote = job.type === "remote";
                        return (
                            <div
                                key={String(job._id)}
                                style={{ border: "1px solid #e0e0e0", borderRadius: "8px", padding: "1.25rem" }}
                            >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem" }}>
                                    <h2 style={{ margin: 0, fontSize: "1.1rem" }}>{job.title}</h2>
                                    <span style={{
                                        padding: "0.25rem 0.6rem",
                                        borderRadius: "999px",
                                        fontSize: "0.75rem",
                                        fontWeight: 600,
                                        background: isRemote ? "#eff6ff" : "#f0fdf4",
                                        color: isRemote ? "#1d4ed8" : "#15803d",
                                    }}>
                                        {isRemote ? "🌐 Remote" : "📍 In-Person"}
                                    </span>
                                </div>

                                <p style={{ margin: "0.5rem 0 0.25rem", color: "#555", fontSize: "0.9rem" }}>
                                    {!isRemote && `📍 ${job.location?.city}, ${job.location?.state}  •  `}
                                    💰 ₹{job.budget}
                                    {job.duration && `  •  ⏱ ${job.duration}`}
                                </p>

                                <p style={{ margin: "0.25rem 0 0", color: "#888", fontSize: "0.8rem" }}>
                                    🏷️ {Array.isArray(job.category) ? job.category.join(", ") : job.category}
                                    {(job.openings ?? 1) > 1 && `  •  👥 ${spotsLeft} spot${spotsLeft !== 1 ? "s" : ""} left`}
                                </p>

                                <Link href={`/jobs/${job._id}`}>
                                    <button style={{ marginTop: "0.75rem", padding: "0.5rem 1rem", background: "#0070f3", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>
                                        View Details →
                                    </button>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
