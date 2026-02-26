"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { JOB_CATEGORIES, JOB_DURATIONS, BUDGET_TYPES } from "@/lib/constants";

interface PincodeResult {
    city: string;
    state: string;
}

async function lookupPincode(pincode: string): Promise<PincodeResult | null> {
    try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = await res.json();
        if (data[0]?.Status === "Success" && data[0].PostOffice?.length > 0) {
            const po = data[0].PostOffice[0];
            return { city: po.District, state: po.State };
        }
        return null;
    } catch {
        return null;
    }
}

export default function PostJobPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: JOB_CATEGORIES[0],
        type: "in-person" as "in-person" | "remote",
        duration: JOB_DURATIONS[0].value,
        budget: "",
        openings: "1",
        deadline: "",
        location: {
            pincode: "",
            city: "",
            state: "",
            address: "",
        },
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [pincodeLoading, setPincodeLoading] = useState(false);
    const [pincodeError, setPincodeError] = useState("");

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    function handleLocationChange(
        e: React.ChangeEvent<HTMLInputElement>
    ) {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            location: { ...prev.location, [name]: value },
        }));
    }

    async function handlePincode(e: React.ChangeEvent<HTMLInputElement>) {
        const pincode = e.target.value;
        setFormData((prev) => ({
            ...prev,
            location: { ...prev.location, pincode, city: "", state: "" },
        }));
        setPincodeError("");

        if (pincode.length === 6) {
            setPincodeLoading(true);
            const result = await lookupPincode(pincode);
            setPincodeLoading(false);
            if (result) {
                setFormData((prev) => ({
                    ...prev,
                    location: { ...prev.location, pincode, city: result.city, state: result.state },
                }));
            } else {
                setPincodeError("Could not find location for this pincode.");
            }
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await fetch("/api/jobs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    budget: Number(formData.budget),
                    openings: Number(formData.openings),
                }),
            });

            const data = await response.json();
            console.log(data);

            if (!response.ok) {
                setError(data.error || "Something went wrong");
                return;
            }

            router.push("/jobs");
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    const inputStyle: React.CSSProperties = {
        width: "100%",
        padding: "0.75rem",
        borderRadius: "6px",
        border: "1px solid #ccc",
        boxSizing: "border-box",
        fontSize: "1rem",
    };

    const labelStyle: React.CSSProperties = {
        display: "block",
        marginBottom: "0.4rem",
        fontWeight: 600,
        fontSize: "0.9rem",
    };

    return (
        <div style={{ fontFamily: "sans-serif", maxWidth: "640px", margin: "0 auto", padding: "2rem", color: "#000" }}>
            <Link href="/dashboard">← Back to Dashboard</Link>
            <h1 style={{ marginTop: "1rem" }}>📋 Post a New Job</h1>
            <p style={{ color: "#555" }}>Fill in the details and find the right person locally.</p>

            {error && (
                <div style={{ marginTop: "1rem", padding: "0.75rem 1rem", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", color: "#dc2626" }}>
                    ⚠️ {error}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginTop: "2rem" }}>

                {/* Title */}
                <div>
                    <label style={labelStyle}>Job Title</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange}
                        placeholder="e.g. Need a delivery person for 1 day" required style={inputStyle} />
                </div>

                {/* Description */}
                <div>
                    <label style={labelStyle}>Job Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange}
                        rows={4} placeholder="Describe the job in detail..." required
                        style={{ ...inputStyle, resize: "vertical" }} />
                </div>

                {/* Category */}
                <div>
                    <label style={labelStyle}>Category</label>
                    <select name="category" value={formData.category} onChange={handleChange} style={inputStyle}>
                        {JOB_CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                {/* Type */}
                <div>
                    <label style={labelStyle}>Job Type</label>
                    <div style={{ display: "flex", gap: "1rem" }}>
                        {["in-person", "remote"].map((t) => (
                            <label key={t} style={{ display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer", fontWeight: 400 }}>
                                <input type="radio" name="type" value={t}
                                    checked={formData.type === t}
                                    onChange={handleChange} />
                                {t === "in-person" ? "📍 In-Person" : "🌐 Remote"}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Duration */}
                <div>
                    <label style={labelStyle}>Duration</label>
                    <select name="duration" value={formData.duration} onChange={handleChange} style={inputStyle}>
                        {JOB_DURATIONS.map((d) => (
                            <option key={d.value} value={d.value}>{d.label}</option>
                        ))}
                    </select>
                </div>

                {/* Budget */}
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "0.75rem" }}>
                    <div>
                        <label style={labelStyle}>Budget (₹)</label>
                        <input type="number" name="budget" value={formData.budget} onChange={handleChange}
                            placeholder="e.g. 500" min="100" required style={inputStyle} />
                    </div>
                    <div>
                        <label style={labelStyle}>Payment Type</label>
                        
                    </div>
                </div>

                {/* Openings + Deadline */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                    <div>
                        <label style={labelStyle}>People Needed</label>
                        <input type="number" name="openings" value={formData.openings} onChange={handleChange}
                            min="1" max="50" required style={inputStyle} />
                    </div>
                    <div>
                        <label style={labelStyle}>Apply Before</label>
                        <input type="date" name="deadline" value={formData.deadline} onChange={handleChange}
                            required min={new Date().toISOString().split("T")[0]} style={inputStyle} />
                    </div>
                </div>

                {/* Location — only shown for in-person */}
                {formData.type === "in-person" && (
                    <div style={{ border: "1px solid #e0e0e0", borderRadius: "8px", padding: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <p style={{ margin: 0, fontWeight: 600 }}>📍 Job Location</p>

                        <div>
                            <label style={labelStyle}>Pincode</label>
                            <input type="text" name="pincode" value={formData.location.pincode}
                                onChange={handlePincode} placeholder="e.g. 411001"
                                maxLength={6} pattern="\d{6}" required style={inputStyle} />
                            {pincodeLoading && <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "#888" }}>Looking up pincode...</p>}
                            {pincodeError && <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "#dc2626" }}>{pincodeError}</p>}
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                            <div>
                                <label style={labelStyle}>City</label>
                                <input type="text" value={formData.location.city} readOnly
                                    placeholder="Auto-filled from pincode"
                                    style={{ ...inputStyle, background: "#f5f5f5", color: formData.location.city ? "#000" : "#aaa" }} />
                            </div>
                            <div>
                                <label style={labelStyle}>State</label>
                                <input type="text" value={formData.location.state} readOnly
                                    placeholder="Auto-filled from pincode"
                                    style={{ ...inputStyle, background: "#f5f5f5", color: formData.location.state ? "#000" : "#aaa" }} />
                            </div>
                        </div>

                        <div>
                            <label style={labelStyle}>Address (optional)</label>
                            <input type="text" name="address" value={formData.location.address}
                                onChange={handleLocationChange}
                                placeholder="Building / street / landmark"
                                style={inputStyle} />
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                        padding: "0.85rem",
                        background: isLoading ? "#93c5fd" : "#0070f3",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        cursor: isLoading ? "not-allowed" : "pointer",
                        fontSize: "1rem",
                        transition: "background 0.2s",
                    }}
                >
                    {isLoading ? "Posting..." : "🚀 Post Job"}
                </button>
            </form>
        </div>
    );
}
