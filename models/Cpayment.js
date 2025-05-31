const mongoose = require("mongoose")

module.exports = mongoose.model("product", new mongoose.Schema({
    product: { type: mongoose.Types.ObjectId, ref: "product", required: true },
    customer: { type: mongoose.Types.ObjectId, ref: "customer", required: true },
    name: { type: String, required: true },
    price: { type: String, required: true },
    category: { type: String, required: true },
    photo: { type: String, required: true },
    spec: { type: String, required: true },
    razorpay_order_id: { type: String, required: true },
    razorpay_payment_id: { type: String, required: true },
}, { timestamps: true }))