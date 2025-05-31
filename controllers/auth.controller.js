const Admin = require("../models/Admin")
const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")
const sendEmail = require("./../utils/email")
const { differenceInSeconds } = require("date-fns")
const { OAuth2Client } = require("google-auth-library")
const Customer = require("../models/Customer")
exports.adminRegister = asyncHandler(async (req, res) => {
    await Admin.create(req.body)
    res.json({ message: "Admin Register Success" })
})


exports.sendOTP = asyncHandler(async (req, res) => {
    const { username } = req.body
    const result = await Admin.findOne({
        $or: [
            { email: username },
            { mobile: username },
        ]
    })
    if (!result) {
        return res.status(401).json({ message: "Invalid Email OR Mobile !" })
    }
    //otp
    const otp = Math.floor(100000 + Math.random() * 900000)
    //email
    await sendEmail({
        to: result.email,
        subject: "Login OTP",
        message: `Your Login OTP ${otp}`
    })
    await Admin.findByIdAndUpdate(result._id, { otp, otpSendOn: new Date() })
    res.json({ message: "OTP Send Success" })                              //admin
})


exports.adminLogin = asyncHandler(async (req, res) => {
    const { username, otp } = req.body
    const result = await Admin.findOne({
        $or: [
            { email: username },
            { mobile: username },
        ]
    })
    if (!result) {
        return res.status(401).json({ message: "Invalid Email OR Mobile !" })
    }
    if (result.otp != otp) {
        return res.status(401).json({ message: "Invalid OTP !" })
    }
    if (differenceInSeconds(new Date(), result.otpSendOn) > 120) {
        return res.status(401).json({ message: "OTP Expired !" })
    }
    await Admin.findByIdAndUpdate(result._id, { otp: null })
    const token = jwt.sign({ _id: result._id }, process.env.JWT_KEY)
    res.cookie("ADMIN", token, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true, secure: false })
    res.json({
        message: "Admin Login Success", result: {
            name: result.name,
            email: result.email,
            mobile: result.mobile,
        }
    })
})


exports.adminLogout = asyncHandler(async (req, res) => {
    res.clearCookie("ADMIN")
    res.json({ message: "Admin Logout Success" })
})





exports.continueWithGoogle = asyncHandler(async (req, res) => {
    const { credential } = req.body
    const googleData = new OAuth2Client({ clientId: process.env.GOOGLE_CLIENT_ID })
    const data = await googleData.verifyIdToken({ idToken: credential })

    if (!data) {
        return res.status(401).json({ message: "Unable To Process !" })
    }
    const { payload } = data

    let result = await Customer.findOne({ email: payload.email })
    if (!result) {
        //register
        result = await Customer.create({
            name: payload.name,
            email: payload.email,
            hero: payload.picture,
        })
    }

    //login
    const token = jwt.sign({ _id: result._id }, process.env.JWT_KEY)
    res.cookie("CUSTOMER", token, { maxAge: 1000 * 60 * 60 * 24, secure: false, httpOnly: true })
    res.json({
        message: "Customer Login Success", result: {
            name: result.name,
            email: result.email,
            hero: result.hero,
        }

    })

})


exports.logoutCustomer = asyncHandler(async (req, res) => {
    res.clearCookie("CUSTOMER")
    res.json({ message: "Customer Logout Success" })
})