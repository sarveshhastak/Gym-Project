const router = require("express").Router()
const customer = require("./../controllers/customer.controller")
router
    .post("/place-order", customer.placeOrder)
    .get("/get-order", customer.getAllOrders)
    .post("/initiate-payment", customer.initiatePayment)
    .post("/complete-payment", customer.completePayment)

module.exports = router