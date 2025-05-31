const router = require("express").Router()
const auth = require("./../controllers/auth.controller")
router
    .post("/register-admin", auth.adminRegister)
    .post("/sendotp", auth.sendOTP)
    .post("/login-admin", auth.adminLogin)
    .post("/logout-admin", auth.adminLogout)


    .post("/continue-with-google", auth.continueWithGoogle)
    .post("/logout-customer", auth.logoutCustomer)
module.exports = router