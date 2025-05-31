const path = require("path")
const asyncHandler = require("express-async-handler")
const Product = require("../models/Product")
const { productPhotoUpload } = require("../utils/Upload")
const cloud = require("./../utils/cloud")
const Order = require("../models/Order")


// exports.addProduct = async (req, res) => {
//     productPhotoUpload(req, res, async err => {
//         if (err) {
//             return res.status(400).json({ message: err.message || "unable to upload" })
//         }

//         const { secure_url } = await cloud.uploader.upload(req.file.path)
//         await Product.create({ ...req.body, photo: secure_url })
//         res.json({ message: "Product Create Success" })

//     })
// }


// exports.getProduct = async (req, res) => {
//     const result = await Product.find()
//     res.json({ message: "Product Get Success", result })
// }


// exports.updateProduct = asyncHandler(async (req, res) => {
//     productPhotoUpload(req, res, async (err) => {
//         const { pid } = req.params
//         if (req.file) {
//             console.log(req.file);

//             const result = await Product.findById(pid)
//             await cloud.uploader.destroy(path.basename(result.photo).split(".")[0])

//             const { secure_url } = await cloud.uploader.upload(req.file.path)
//             await Product.findByIdAndUpdate(pid, { ...req.body, photo: secure_url })
//             res.json({ message: "Product Update Success" })
//         } else {
//             console.log(req.body);

//             await Product.findByIdAndUpdate(pid, req.body)
//             res.json({ message: "Product Update Success" })
//         }
//     })
// })



// exports.deleteProduct = asyncHandler(async (req, res) => {
//     const { pid } = req.params
//     const result = await Product.findById(pid)
//     await cloud.uploader.destroy(path.basename(result.image).split(".")[0])
//     await Product.findByIdAndDelete(pid)
//     res.json({ message: "Product Delete Success" })
// })





// exports.addProduct = asyncHandler(async (req, res) => {
//     productPhotoUpload(req, res, async (err) => {
//         // console.log(req.file);
//         // console.log(req.body);
//         if (req.file) {
//             const { secure_url } = await cloud.uploader.upload(req.file.path)
//             await Product.create({ ...req.body, photo: secure_url })
//         }
//         res.json({ message: "Product Create Success" })
//     })
// })


exports.addProduct = asyncHandler(async (req, res) => {
    productPhotoUpload(req, res, async err => {
        if (err) {
            return res.status(400).json({ message: "Multer Error !", error: err.message })
        }
        const img = []
        for (const item of req.files) {
            const { secure_url } = await cloud.uploader.upload(item.path)
            img.push(secure_url)
        }
        await Product.create({ ...req.body, photo: img })
        // console.log(req.files)
        // console.log(req.body)
        res.json({ message: "Product Add Success" })
    })
})

exports.getProduct = asyncHandler(async (req, res) => {
    const result = await Product.find()
    res.json({ message: "Product Read Success", result })
})


exports.updateProduct = asyncHandler(async (req, res) => {
    productPhotoUpload(req, res, async (err) => {
        if (req.files) {
            //new file recieved
            const { pid } = req.params
            const result = await Product.findById(pid)
            for (const item of result.photo) {
                try {
                    await cloud.uploader.destroy(path.basename(item).split(".")[0])
                } catch (error) {
                    console.log("delete", error);
                }
            }
            const img = []
            for (const item of req.files) {
                try {
                    const { secure_url } = await cloud.uploader.upload(item.path)
                    img.push(secure_url)

                } catch (error) {
                    console.log("add", error);

                }
            }
            await Product.findByIdAndUpdate(req.params.pid, { ...req.body, photo: img })
            console.log("heooo");

            res.json({ message: "Product Update Success" })
        } else {
            await Product.findByIdAndUpdate(req.params.pid, req.body)
            console.log("bye"); ``

            res.json({ message: "Product Update Success" })
        }
    })
})

// exports.deleteProduct = asyncHandler(async (req, res) => {
//     const { pid } = req.params
//     const result = await Product.findById(pid)
//     await cloud.uploader.destroy(path.basename(result.photo))
//     await Product.findByIdAndDelete(pid)
//     res.json({ message: "Product Delete Success" })
// })

exports.deleteProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    const result = await Product.findById(pid)
    for (const item of result.photo) {
        await cloud.uploader.destroy(path.basename(item).split(".")[0])
    }
    await Product.findByIdAndDelete(pid)
    res.json({ message: "Product Delete Success" })
})

exports.getAllOrders = asyncHandler(async (req, res) => {
    // const result = await Order.find({ customer: req.customer }).populate("customer").populate("products.product")
    const result = await Order.find().populate("customer").populate("products.product")
    res.json({ message: "Order get  Success", result })
})