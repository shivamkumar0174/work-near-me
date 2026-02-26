import Link from "next/link";
import { connectDB } from "@/lib/db";
import Job from "@/lib/models/Job";

export default async function JobDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    await connectDB();
    const job = await Job.findById(id).lean();

    if (!job) {
        return (
            <div style={{ fontFamily: "sans-serif", maxWidth: "800px", margin: "4rem auto", padding: "2rem", textAlign: "center" }}>
                <h1>❌ Job Not Found</h1>
                <p>No job exists with this ID.</p>
                <Link href="/jobs">← Back to all jobs</Link>
            </div>
        );
    }

    const isRemote = job.type === "remote";
    const spotsLeft = (job.openings ?? 1) - (job.hiredCount ?? 0);

    return (
        <div style={{ fontFamily: "sans-serif", maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
            <Link href="/jobs">← Back to all jobs</Link>

            <div style={{ marginTop: "1.5rem", border: "1px solid #e0e0e0", borderRadius: "12px", padding: "2rem" }}>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    <span style={{ background: "#e8f4fd", color: "#0070f3", padding: "0.25rem 0.75rem", borderRadius: "99px", fontSize: "0.85rem" }}>
                        🏷️ {Array.isArray(job.category) ? job.category.join(", ") : job.category}
                    </span>
                    <span style={{
                        padding: "0.25rem 0.75rem",
                        borderRadius: "99px",
                        fontSize: "0.85rem",
                        background: isRemote ? "#eff6ff" : "#f0fdf4",
                        color: isRemote ? "#1d4ed8" : "#15803d",
                    }}>
                        {isRemote ? "🌐 Remote" : "📍 In-Person"}
                    </span>
                    <span style={{ background: "#fefce8", color: "#854d0e", padding: "0.25rem 0.75rem", borderRadius: "99px", fontSize: "0.85rem" }}>
                        ⏱ {job.duration ?? "Flexible"}
                    </span>
                </div>

                <h1 style={{ marginTop: "1rem", marginBottom: "0.5rem" }}>{job.title}</h1>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", color: "#555", marginBottom: "1.5rem", fontSize: "0.95rem" }}>
                    {!isRemote && (
                        <span>📍 {job.location?.city}, {job.location?.state} — {job.location?.pincode}</span>
                    )}
                    <span>
                        💰 ₹{job.budget}
                       
                    </span>
                    {(job.openings ?? 1) > 1 && (
                        <span>👥 {spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} remaining</span>
                    )}
                    {job.deadline && (
                        <span>📅 Apply by {new Date(job.deadline).toLocaleDateString("en-IN")}</span>
                    )}
                </div>

                <p style={{ lineHeight: "1.7", color: "#333" }}>{job.description}</p>

                {job.location?.address && (
                    <p style={{ marginTop: "1rem", color: "#555" }}>📌 {job.location.address}</p>
                )}

                <button style={{ marginTop: "1.5rem", padding: "0.75rem 2rem", background: "#0070f3", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "1rem" }}>
                    ✉️ Apply for this Job
                </button>
            </div>
        </div>
    );
}
