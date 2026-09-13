import wrapAsync from "../utils/tryCatchWrapper.js";
import { BadRequestError } from "../utils/errorHandler.js";
import { uploadPdfService, getUserPdfsService } from "../services/uploadPdfService.js";
import { StatusCodes } from "http-status-codes";
import { deletePdfService } from "../services/uploadPdfService.js";

export const uploadPdfController = wrapAsync(async (req, res) => {

    const file = req.file;

    if (!file) {
        throw new BadRequestError("No file uploaded");
    }

    const result = await uploadPdfService(file, req.userId);

    res.status(StatusCodes.OK).json({
        success: true,
        result
    });
});

export const getUserPdfsController = wrapAsync(async (req, res) => {
    const userId = req.userId;
    const pdfs = await getUserPdfsService(userId);
    res.status(StatusCodes.OK).json({
        success: true,
        pdfs
    }); 
});



export const deletePdfController = wrapAsync(async (req, res) => {
    const { pdfId } = req.params;
    const userId = req.userId;

    const result = await deletePdfService(pdfId, userId);

    res.status(StatusCodes.OK).json({
        success: true,
        result
    });
});