const mongoose = require("mongoose")

module.exports = mongoose.model("product", new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: String, required: true },
    category: { type: String, required: true },
    photo: { type: [String], required: true },
    spec: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
}, { timestamps: true }))