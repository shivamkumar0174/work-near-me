import Link from "next/link";

export default function PosterLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div style={{ display: "flex", minHeight: "100vh", fontFamily: "sans-serif" }}>
            <aside
                style={{
                    width: "220px",
                    background: "#0f172a",
                    color: "#fff",
                    padding: "2rem 1rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                    flexShrink: 0,
                }}
            >
                <div style={{ marginBottom: "2rem" }}>
                    <h2 style={{ margin: 0, fontSize: "1rem", color: "#94a3b8" }}>POSTER PANEL</h2>
                </div>

                <NavLink href="/dashboard">📊 Dashboard</NavLink>
                <NavLink href="/post-job">+ Post a Job</NavLink>
                <NavLink href="/my-jobs">📋 My Jobs</NavLink>

                <div style={{ marginTop: "auto", borderTop: "1px solid #1e293b", paddingTop: "1rem" }}>
                    <NavLink href="/">← Back to Site</NavLink>
                </div>
            </aside>

            <div style={{ flex: 1, padding: "2rem", background: "#f8fafc" }}>
                {children}
            </div>
        </div>
    );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            style={{
                color: "#cbd5e1",
                textDecoration: "none",
                padding: "0.6rem 1rem",
                borderRadius: "6px",
                fontSize: "0.9rem",
                display: "block",
            }}
        >
            {children}
        </Link>
    );
}
