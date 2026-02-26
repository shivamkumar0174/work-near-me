"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchBar() {
    const [query, setQuery] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentQuery = searchParams.get("q") || "";

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/jobs?q=${encodeURIComponent(query.trim())}`);
        } else {
            router.push("/jobs");
        }
    }

    return (
        <form onSubmit={handleSearch} style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={currentQuery ? `Searching: "${currentQuery}"` : "Search jobs, cities, skills..."}
                style={{
                    flex: 1,
                    padding: "0.75rem 1rem",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    fontSize: "1rem",
                }}
            />
            <button
                type="submit"
                style={{
                    padding: "0.75rem 1.5rem",
                    background: "#0070f3",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "1rem",
                }}
            >
                🔍 Search
            </button>
        </form>
    );
}
