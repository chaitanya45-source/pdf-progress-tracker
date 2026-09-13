import PDF from "../models/pdf.model.js";

const createPdf = async (pdfData) => {
    const pdf = new PDF(pdfData);

    return await pdf.save();
};

export const findPdfsByUserId = async (userId) => { 
    return await PDF.find({ userId });
};

export const deletePdfById = async (pdfId, userId) => {
    return await PDF.findOneAndDelete({
        _id: pdfId,
        userId,
    });
};
export default createPdf;
