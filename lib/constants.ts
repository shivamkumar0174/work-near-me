export const SKILLS = [
    "Driving",
    "Delivery",
    "Cooking",
    "Cleaning",
    "Carpentry",
    "Plumbing",
    "Electrical Work",
    "Painting",
    "Moving & Lifting",
    "Gardening",
    "Tutoring",
    "Data Entry",
    "Photography",
    "Video Editing",
    "Graphic Design",
    "Tech Help",
    "Customer Service",
    "Security Guard",
    "Event Helper",
    "Other",
] as const;

export type Skill = (typeof SKILLS)[number];

export const JOB_CATEGORIES = [
    "Delivery",
    "Cooking",
    "Cleaning",
    "Tutoring",
    "Design",
    "Tech Help",
    "Moving",
    "Photography",
    "Other",
] as const;

export type JobCategory = (typeof JOB_CATEGORIES)[number];

export const JOB_DURATIONS = [
    { value: "few-hours", label: "A few hours" },
    { value: "1 day", label: "1 Day" },
    { value: "2-3 days", label: "2–3 Days" },
    { value: "up-to-1-week", label: "Up to 1 Week" },
] as const;

export const BUDGET_TYPES = [
    { value: "fixed", label: "Fixed Price" },
    { value: "per-day", label: "Per Day" },
    { value: "per-hour", label: "Per Hour" },
] as const;
