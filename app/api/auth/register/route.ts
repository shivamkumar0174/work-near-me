import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const { firstName, lastName, email, password, role, skills, location } = body;

        if (!firstName || !email || !password) {
            return NextResponse.json(
                { success: false, error: "First name, email, and password are required" },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { success: false, error: "Password must be at least 6 characters" },
                { status: 400 }
            );
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return NextResponse.json(
                { success: false, error: "An account with this email already exists" },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            firstName,
            lastName: lastName || "",
            email: email.toLowerCase(),
            password: hashedPassword,
            role: role || "seeker",
            ...(role === "seeker" && {
                skills: Array.isArray(skills) ? skills : [],
                location: location || {},
            }),
        });

        const { password: _, ...userWithoutPassword } = newUser.toObject();
        void _;

        return NextResponse.json(
            { success: true, data: userWithoutPassword },
            { status: 201 }
        );
    } catch (error: unknown) {
        if (error instanceof Error && error.name === "ValidationError") {
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 400 }
            );
        }
        console.error("Register error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to create account" },
            { status: 500 }
        );
    }
}
