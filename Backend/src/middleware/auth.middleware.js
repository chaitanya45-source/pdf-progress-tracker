import { findUserById } from "../dao/userDao.js";
import { verifyToken } from "../utils/helper.js";
import wrapAsync from "../utils/tryCatchWrapper.js";

export const authMiddleware = wrapAsync(async (req, res, next) => {
    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decodedToken = verifyToken(token);
        const user = await findUserById(decodedToken);
        if (!user) {
            throw new Error("Unauthorized");
        }
        req.user = user;
        req.userId = user._id;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
})