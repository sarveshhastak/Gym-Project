const nodemailer = require("nodemailer")

const sendEmail = ({ to, subject, message }) => new Promise((resolve, reject) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: { user: process.env.EMAIL, pass: process.env.PASS }
        })
        transporter.sendMail({ to, subject, text: message }, (err) => {
            if (err) {
                console.log(err)
                reject("Unable To Send Email !")

            }
            console.log("Email Send")
            resolve("Email Send")

        })
    } catch (error) {
        console.log(error)
        reject(error.message)
    }
})

module.exports = sendEmail