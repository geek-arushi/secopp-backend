import User from "../models/user-model.js"
import jwt from "jsonwebtoken"

export const adminAuth = async (req, res, next) => {
    try {
        const token = req.cookies.uid
        if (!token) {
            req.flash("flashMessage", ["Login to access this page", "alert-danger"])
            return res.redirect("/login")
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const userData = await User.findById(decoded.id)

        if (userData) {
            req.id = userData._id
        } else {
            req.flash("flashMessage", ["Login to access this page", "alert-danger"])
            return res.redirect('/login')
        }

        next()
    } catch (error) {
        console.log("Error in adminAuth middleware", error)
    }
}