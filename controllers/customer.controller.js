const asyncHandler = require("express-async-handler")
const Order = require("../models/Order")
const razorpay = require("razorpay")
const crypto = require("crypto")
const Customer = require("../models/Customer")
const sendEmail = require("../utils/email")


exports.placeOrder = asyncHandler(async (req, res) => {
    await Order.create({ ...req.body, customer: req.customer })
    const result = await Customer.findOne(req.body.email)
    await sendEmail({
        to: result.email,
        subject: `Hey ${result.name} Your Order Placed Successfuly`,
        message: "Thank You For Your Purchase We Will Keep You Updating Shipment Details"
    })

    res.json({ message: "Order Placed  Success" })
})


exports.getAllOrders = asyncHandler(async (req, res) => {
    // const result = await Order.find({ customer: req.customer }).populate("customer").populate("products.product")
    const result = await Order.find({ customer: req.customer }).populate("products.product")
    res.json({ message: "Order get  Success", result })
})

exports.initiatePayment = asyncHandler(async (req, res) => {
    const rz = new razorpay({
        key_id: process.env.RAZORPAY_API_KEY,
        key_secret: process.env.RAZORPAY_SCERET_KEY,
    })
    rz.orders.create({
        amount: req.body.amount * 100,
        currency: "INR",
        receipt: Date.now().toString()
    }, (err, order) => {
        if (err) {
            return res.status(400).json({ message: err.message || "Unable To Process Payment !" })
        }
        res.json({ message: "initiatePayment Success", result: order })
    })
})


exports.completePayment = asyncHandler(async (req, res) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    } = req.body
    const x = crypto.createHmac("sha256", process.env.RAZORPAY_SCERET_KEY)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex")
    if (razorpay_signature !== x) {
        return res.status(400).json({ message: "Invalid Payment !" })
    }
    //add to database
    res.json({ message: "Payment Successful" })

})