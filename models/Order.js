const mongoose = require("mongoose")

module.exports = mongoose.model("order", new mongoose.Schema({
    customer: { type: mongoose.Types.ObjectId, ref: "customer", required: true },
    products: [
        {
            product: { type: mongoose.Types.ObjectId, ref: "product", required: true },
            qty: { type: String, required: true },

        }
    ],
    address: { type: String, required: true },
    city: { type: String, required: true },
    status: { type: String, enum: ["placed", "shiped", "delivered", "cancle", "out"], default: "placed" },

}, { timestamps: true }))