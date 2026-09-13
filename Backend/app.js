import express from "express";
import path from "path";
import dotenv from "dotenv";
import connectionDB from "./src/config/mongoConfig.js";
import pdfRoutes from "./src/routes/pdfRoutes.js";
import authRoutes from "./src/routes/authRoute.js";
import progressRoutes from "./src/routes/progressRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorHandler } from "./src/utils/errorHandler.js";

dotenv.config();
const app = express();

app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/uploads", express.static(path.join(process.cwd(), "src/uploads")));

app.use("/api/pdfs", pdfRoutes);
app.use("/api/users", authRoutes)
app.use("/api/progress", progressRoutes)
app.use("/api/delete",pdfRoutes);

app.use(errorHandler);

app.get("/", (req, res) => {
    res.json("Server is running");
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    connectionDB();
    console.log(`Server running on port ${PORT}`);
});