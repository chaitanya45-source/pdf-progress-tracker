import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        pdfId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PDF",
            required: true
        },

        pageNumber: {
            type: Number,
            required: true,
            min: 1
        },

        selectedText: {
            type: String,
            trim: true
        },

        surroundingText: {
            type: String,
            trim: true
        },

        position: {
            x: Number,
            y: Number
        }
    },
    {
        timestamps: true
    }
);

progressSchema.index(
    { userId: 1, pdfId: 1 },
    { unique: true }
);

const Progress = mongoose.model("Progress", progressSchema);

export default Progress;