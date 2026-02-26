import mongoose, { Schema } from "mongoose";

export interface IApplication {
    jobId: string;
    seekerId: string;
    coverMessage: string;
    status: string;
    
}

const ApplicationSchema = new Schema(
    {
        jobId: {
            type: Schema.Types.ObjectId,
            ref: "Job",
            required: true,
        },
        seekerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        coverMessage: {
            type: String,
            trim: true,
            maxlength: [500, "Cover message cannot exceed 500 characters"],
        },
        status: {
            type: String,
            enum: ["pending", "shortlisted", "rejected", "hired"],
            default: "pending",
        },
    },
    { timestamps: true });

const Application = mongoose.models.Application || mongoose.model("Application", ApplicationSchema);

export default Application;