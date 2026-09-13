import { PDFParse } from "pdf-parse";
import cloudinary from "../config/cloudinary.js";
import createPdf from "../dao/pdfDao.js";
import { findPdfsByUserId } from "../dao/pdfDao.js";
import { deletePdfById } from "../dao/pdfDao.js";
import { deleteProgressById } from "../dao/progressDao.js";


export const uploadPdfService = async (file, userId) => {

    if (!file) {
        throw new Error("PDF file is required");
    }

    const pdfBuffer = file.buffer;


    const cloudinaryResult = await new Promise((resolve, reject) => {

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: "pdf-progress-tracker",
                resource_type: "raw",
                public_id: `${Date.now()}-${file.originalname}`,
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );

        uploadStream.end(pdfBuffer);
    });

    const parser = new PDFParse({
        data: pdfBuffer
    });

    try {

        const infoResult = await parser.getInfo();

        const textResult = await parser.getText();

        const pdfData = {
            title: file.originalname,
            fileUrl: cloudinaryResult.secure_url,
            cloudinaryPublicId: cloudinaryResult.public_id,
            fileSize: file.size,
            totalPages: infoResult.total,
            userId: userId
        };

        const pdf = await createPdf(pdfData);

        return pdf;

    } finally {

        await parser.destroy();
    }
};
export const getUserPdfsService = async (userId) => {
    return await findPdfsByUserId(userId);
};



export const deletePdfService = async (pdfId, userId) => {
 
    const pdf = await deletePdfById(pdfId, userId);
 
    
    if (!pdf) {
        throw new Error("PDF not found");
    }
 
    if (pdf.cloudinaryPublicId) {
        try {
            await cloudinary.uploader.destroy(
                pdf.cloudinaryPublicId,
                { resource_type: "raw" }   // delete from cloudinary
            );
        } catch (error) {
            
            console.error(
                `Failed to delete Cloudinary file (public_id: ${pdf.cloudinaryPublicId}):`,
                error
            );
        }
    }
 
    const progress = await deleteProgressById(pdfId, userId);
 
    return { pdf, progress };
};
 