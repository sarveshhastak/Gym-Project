const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const { adminProtected, customerProtected } = require("./middleware/auth.middleware")
require("dotenv").config()
const app = express()
app.use(express.json())
const path = require("path");
app.use(express.static("dist"));
app.use(cors({ origin: "https://gym-project-uwzk.onrender.com", credentials: true }))
app.use(cookieParser())
app.use("/api/auth", require("./routes/auth.route"))
app.use("/api/product", adminProtected, require("./routes/admin.route"))
app.use("/api/public", require("./routes/public.routes"))
app.use("/api/customer", customerProtected, require("./routes/customer.route"))
app.use("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
});
mongoose.connect(process.env.MONGO_URL)
mongoose.connection.once("open", () => {
    console.log("Mongodb Connected...")
    app.listen(process.env.PORT, console.log("Server Running...")
    )

})