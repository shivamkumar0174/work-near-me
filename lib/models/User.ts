import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: "seeker" | "poster";
    avatar: string;
    createdAt: Date;
    phone: string;
    bio: string;
    skills: string[];
    location: {
        city: string;
        state: string;
        pincode: string;
    };
    rating: {
        avg: number;
        count: number;
    };
}

const UserSchema = new Schema<IUser>(
    {
        firstName: {
            type: String,
            required: [true, "First name is required"],
            trim: true,
        },
        lastName: {
            type: String,
            trim: true,
            default: "",
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["seeker", "poster"],
            default: "seeker",
        },
        avatar: {
            type: String,
        },
        phone: {
            type: String,
            trim: true,
        },
        bio: {
            type: String,
            trim: true,
            maxlength: [500, "Bio cannot exceed 500 characters"],
        },
        skills: {
            type: [String],
            default: [],
        },
        location: {
            city:{
                type: String,
                // required: true,
                trim: true,
            },
            state: {
                type: String,
                // required: true,
                trim: true,
            },
            pincode: {
                type: String,
                // required: true,
                trim: true,
            }
        },
        rating: {
            avg: {
                type: Number,
                default: 0,
            },
            count: {
                type: Number,
                default: 0,
            }
        }
    },
    { timestamps: true }
);

const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
