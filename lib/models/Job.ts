import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IJob extends Document {
    title: string;
    description: string;
    category: [string];
    type: string;
    duration: string;
    budget: number;
    location: {
        city: string;
        state: string;
        pincode: string;
        address: string;
    };
    deadline: Date;
    openings: number;
    hiredCount: number;
    status: string;
    applicantCount: number;
    postedBy: Types.ObjectId;
}

const JobSchema = new Schema<IJob>(
    {
        title: {
            type: String,
            required: [true, "Job title is required"],
            trim: true,
            maxlength: [100, "Job title cannot exceed 100 characters"],
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true,
            maxlength: [1000, "Description cannot exceed 1000 characters"],
        },
        category: {
            type: [String],
            required: [true, "Category is required"],
        },
        type: {
            type: String,
            enum: ["remote", "in-person"],
            default: "in-person",
        },
        duration: {
            type: String,
            enum: ["few-hours", "1 day", "2-3 days", "up-to-1-week"],
        },
        budget: {
            type: Number,
            required: true,
            min: 100,
        },
        location: {
            city: {
                type: String,
                required: true,
                trim: true,
            },
            state: {
                type: String,
                required: true,
                trim: true,
            },
            pincode: {
                type: String,
                required: true,
                trim: true,
            },
            address: {
                type: String,
                trim: true,
                default: "",
            },
        },
        deadline: {
            type: Date,
            required: true,
        },
        openings: {
            type: Number,
            default: 1,
        },
        hiredCount: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ["open", "closed", "in-progress", "completed"],
            default: "open",
        },
        applicantCount: {
            type: Number,
            default: 0,
        },
        postedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

const Job: Model<IJob> =
    mongoose.models.Job || mongoose.model<IJob>("Job", JobSchema);

export default Job;
