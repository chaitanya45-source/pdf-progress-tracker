import express from "express";
import {saveProgressController,getProgressController,getProgressAll} from "../controllers/progressController.js";
import {authMiddleware} from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    saveProgressController
);

router.get("/all",authMiddleware,getProgressAll);


router.get(
    "/:pdfId",
    authMiddleware,
    getProgressController
);


export default router;