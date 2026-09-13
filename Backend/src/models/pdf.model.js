import mongoose from "mongoose";

const pdfSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    cloudinaryPublicId: {
        type: String,
        required: true
    },
    fileSize: {
        type: Number,
        required: true
    },
    totalPages: {
        type: Number,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

const PDF = mongoose.model("PDF", pdfSchema);

export default PDF;