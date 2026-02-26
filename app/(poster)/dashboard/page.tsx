import Link from "next/link";

export default function DashboardPage() {
    return (
        <div style={{ fontFamily: "sans-serif", maxWidth: "900px", margin: "0 auto", padding: "2rem" }}>
            <h1 style={{ marginTop: 0 }}>📊 My Dashboard</h1>
            <p style={{ color: "#555" }}>Manage your job postings here.</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginTop: "2rem" }}>
                {[
                    { label: "Active Jobs", value: "3" },
                    { label: "Total Applications", value: "12" },
                    { label: "Hired", value: "1" },
                ].map((stat) => (
                    <div key={stat.label} style={{ border: "1px solid #e0e0e0", borderRadius: "8px", padding: "1.5rem", textAlign: "center" }}>
                        <h2 style={{ margin: 0, fontSize: "2rem" }}>{stat.value}</h2>
                        <p style={{ margin: "0.25rem 0 0", color: "#555" }}>{stat.label}</p>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: "2rem" }}>
                <Link href="/post-job">
                    <button style={{ padding: "0.75rem 1.5rem", background: "#0070f3", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" }}>
                        + Post a New Job
                    </button>
                </Link>
            </div>
        </div>
    );
}
