import User from "../models/user.model.js";

export const findUserByEmail = async (email) => {
    return await User.findOne({ email });
}

export const findUserByEmailAndPassword = async (email) => {
    return await User.findOne({ email });
}

export const findUserById = async (userId) => {
    return await User.findById(userId);
}

export const createUser = async (username,email,password) => {
    const newUser = new User({username,email,password});
    await newUser.save();
    return newUser;
}