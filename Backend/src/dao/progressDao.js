import Progress from "../models/progress.model.js";

export const createProgress = (progressData) => {
    return Progress.create(progressData);
};

export const findProgress = (userId, pdfId) => {
    return Progress.findOne({
        userId,
        pdfId
    });
};

export const updateProgress = (userId, pdfId, progressData) => {
    return Progress.findOneAndUpdate(
        {
            userId,
            pdfId
        },
        { $set: progressData },
        {
            new: true,
            upsert: true
        }
    );
};

export const findAllProgress = (userId) => {
    return Progress.find({ userId });
}


export const deleteProgressById = async (pdfId, userId) => {
    return await Progress.findOneAndDelete({
        pdfId,
        userId,
    });
};