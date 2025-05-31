const { getPublicProducts, getPublicProductsDetails } = require("../controllers/public.controller")

const router = require("express").Router()
router
    .get("/get-public-products", getPublicProducts)
    .get("/product-details/:pid", getPublicProductsDetails)
module.exports = router