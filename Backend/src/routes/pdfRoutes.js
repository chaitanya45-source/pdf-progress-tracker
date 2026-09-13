import express from "express";
import upload from "../middleware/upload.middleware.js";
import { uploadPdfController, getUserPdfsController, deletePdfController } from "../controllers/pdfController.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/upload", authMiddleware, upload.single("pdf"), uploadPdfController);
router.get("/", authMiddleware, getUserPdfsController);

router.delete("/:pdfId", authMiddleware, deletePdfController);

export default router;
