const multer = require("multer")

const productPhotoUpload = multer({ storage: multer.diskStorage({}) }).array("photo", 5)
const productPhoto = multer({ storage: multer.diskStorage({}) }).single("photo")

module.exports = { productPhotoUpload, productPhoto }