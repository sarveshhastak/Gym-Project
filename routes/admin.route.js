const router = require("express").Router()
const admin = require("./../controllers/admin.controller")
router
    .post("/create-product", admin.addProduct)
    .get("/get-product", admin.getProduct)
    .get("/get-all-orders", admin.getAllOrders)
    .patch("/update-product/:pid", admin.updateProduct)
    .delete("/delete-product/:pid", admin.deleteProduct)

module.exports = router