import { updateProgress, findProgress, findAllProgress } from "../dao/progressDao.js";

export const saveProgressService = async (
    userId,
    pdfId,
    progressData
) => {

    const progress = await updateProgress(
        userId,
        pdfId,
        progressData
    );

    return progress;
};


export const getProgressService = async (
    userId,
    pdfId
) => {

    const progress = await findProgress(
        userId,
        pdfId
    );

    return progress;
};

export const getProgressAllService = async (userId) => {
    const progress = await findAllProgress(userId);
    return progress;
};

