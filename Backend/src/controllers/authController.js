import { cookieOptions } from "../config/cookieConfigOption.js";
import wrapAsync from "../utils/tryCatchWrapper.js";
import { registerUser, loginUser } from "../services/authService.js";


export const register_user = wrapAsync(async(req, res) => {

    const {username , email, password} = req.body;
    const {token , user} = await registerUser(username, email, password);

    res.cookie("accessToken", token , cookieOptions )

    res.status(201).json({
        success: true,
        user,
        message : "User registered successfully"
    })
})

export const login_user = wrapAsync(async(req, res) => {
    const { email, password} = req.body;
    const {token , user} = await loginUser(email, password);
    req.user = user;
    res.cookie("accessToken", token , cookieOptions )

    res.status(200).json({
        success: true,
        user,
        message : "User logged in successfully"
    })
})

export const logout_user = wrapAsync(async(req, res) => {
    res.clearCookie("accessToken",cookieOptions);

    res.status(200).json({
        success: true,
        message : "User logged out successfully"
    })
})


export const get_current_user = wrapAsync(async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});