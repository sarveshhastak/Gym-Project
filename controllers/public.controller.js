const asyncHandler = require("express-async-handler")
const Product = require("../models/Product")

exports.getPublicProducts = asyncHandler(async (req, res) => {
    const result = await Product.find()
    res.json({ message: "Public Product Fetch Success", result })
})

exports.getPublicProductsDetails = asyncHandler(async (req, res) => {
    const result = await Product.findById(req.params.pid)
    res.json({ message: "Product Fetch Success", result })
})