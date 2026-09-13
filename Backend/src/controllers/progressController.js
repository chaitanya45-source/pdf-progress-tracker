import wrapAsync from "../utils/tryCatchWrapper.js";
import { StatusCodes } from "http-status-codes";
import {saveProgressService,getProgressService,getProgressAllService} from "../services/progressService.js";


export const saveProgressController = wrapAsync(
    async (req, res) => {

        const userId = req.userId;

        const {
            pdfId,
            pageNumber,
            selectedText,
            surroundingText,
            position
        } = req.body;

        const progress = await saveProgressService(
            userId,
            pdfId,
            {
                pageNumber,
                selectedText,
                surroundingText,
                position
            }
        );

        res.status(StatusCodes.OK).json({
            success: true,
            progress
        });
    }
);


export const getProgressController = wrapAsync(
    async (req, res) => {

        const userId = req.userId;
        const { pdfId } = req.params;

        const progress = await getProgressService(
            userId,
            pdfId
        );

        res.status(StatusCodes.OK).json({
            success: true,
            progress
        });
    }
);

export const getProgressAll = wrapAsync(async (req, res)=>{
    const userId = req.userId;

    const progress = await getProgressAllService(userId);

    res.status(StatusCodes.OK).json({
        success: true,
        progress
    });
})