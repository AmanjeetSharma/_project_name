import mongoose from "mongoose";

const collegeSchema = new mongoose.Schema(
    {
        collegeId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },

        location: {
            state: {
                type: String,
                required: true,
                trim: true,
                index: true,
            },
            city: {
                type: String,
                required: true,
                trim: true,
                index: true,
            },
        },

        type: {
            type: String,
            required: true,
            enum: [
                "Government",
                "Government Aided",
                "Central University",
                "Private",
            ],
            index: true,
        },

        streams: [
            {
                type: String,
                trim: true,
                index: true,
            },
        ],

        cutoff: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
            index: true,
        },

        affiliation: {
            type: String,
            required: true,
            trim: true,
        },

        facilities: [
            {
                type: String,
                trim: true,
            },
        ],

        scholarshipsAvailableStatus: {
            type: Boolean,
            default: false,
            index: true,
        },

        scholarshipsAvailable: [
            {
                type: String,
                enum: ["SC/ST", "Minority", "Merit-based", "Need-based"],
                trim: true,
            },
        ],

        admissionStatus: {
            type: String,
            enum: ["Open", "Closed", "Upcoming"],
            default: "Open",
            index: true,
        },

        contact: {
            email: {
                type: String,
                required: true,
                lowercase: true,
                trim: true,
                match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
            },

            phone: {
                type: String,
                required: true,
                trim: true,
            },

            website: {
                type: String,
                trim: true,
            },
        },
    },
    {
        timestamps: true,
    }
);


// 🔍 COMPOUND INDEXES (VERY IMPORTANT FOR SEARCH PERFORMANCE)
collegeSchema.index({ "location.state": 1, "location.city": 1 });
collegeSchema.index({ streams: 1, cutoff: 1 });
collegeSchema.index({ name: "text", affiliation: "text" });


// 🔧 PRE-SAVE HOOKS (DATA CLEANING AUTOMATION)
collegeSchema.pre("save", function (next) {
    // Ensure website has https
    if (this.contact?.website && !this.contact.website.startsWith("http")) {
        this.contact.website = `https://${this.contact.website}`;
    }

    next();
});

export const College =
    mongoose.models.College || mongoose.model("College", collegeSchema);

