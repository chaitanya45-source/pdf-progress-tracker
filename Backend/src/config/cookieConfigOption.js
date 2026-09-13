export const cookieOptions = {
    maxAge: 1000 * 60 * 10, // 10 min
    httpOnly: true,
    secure: process.env.NODE_ENV == "production",
    sameSite: process.env.NODE_ENV == "production" ? "none" : "lax",
};