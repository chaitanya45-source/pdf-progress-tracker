import jwt from "jsonwebtoken";

export const signToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET,{expiresIn: "10m"});
}

export const verifyToken = (token) => {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    return decodedToken.id;
}