import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import Job from "@/lib/models/Job";

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const q = searchParams.get("q");
        const category = searchParams.get("category");
        const type = searchParams.get("type");

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

        return NextResponse.json(
            { success: true, count: jobs.length, data: jobs },
            { status: 200 }
        );
    } catch (error) {
        console.error("GET /api/jobs error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch jobs" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.id) {
            return NextResponse.json(
                { success: false, error: "You must be logged in to post a job" },
                { status: 401 }
            );
        }

        if (session.user.role !== "poster") {
            return NextResponse.json(
                { success: false, error: "Only job posters can post jobs" },
                { status: 403 }
            );
        }

        await connectDB();

        const body = await request.json();

        const jobData: Record<string, unknown> = {
            title: body.title,
            description: body.description,
            category: [body.category],
            type: body.type,
            duration: body.duration,
            budget: Number(body.budget),
            deadline: new Date(body.deadline),
            openings: Number(body.openings) || 1,
            postedBy: session.user.id,
        };

        if (body.type === "in-person") {
            jobData.location = {
                city: body.location.city,
                state: body.location.state,
                pincode: body.location.pincode,
                address: body.location.address || "",
            };
        } else {
            jobData.location = {
                city: "Remote",
                state: "",
                pincode: "000000",
                address: "",
            };
        }

        const newJob = await Job.create(jobData);

        return NextResponse.json(
            { success: true, data: newJob },
            { status: 201 }
        );
    } catch (error: unknown) {
        if (error instanceof Error && error.name === "ValidationError") {
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 400 }
            );
        }

        console.error("POST /api/jobs error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to create job" },
            { status: 500 }
        );
    }
}
