import User from "../models/user-model.js"
import jwt from "jsonwebtoken"

export const login = async (req, res) => {
    try {
        res.status(200).render("login", {title: "Second Opinion - Health & Secopp Admin Login", message: req.flash("flashMessage")})
    } catch (error) {
        console.log("Error in auth-controller login", error)
    }
}

export const loginPost = async (req, res) => {
    try {
        const { email, password } = req.body
        const userData = await User.findOne({ email })
        if (!userData) {
            req.flash("flashMessage", ["User not found in our records !!", "alert-danger"])
            return res.redirect("/login")
        }
        if (userData) {
            if (userData.password !== password) {
                req.flash("flashMessage", ["Email or Password is incorrect!","alert-danger"])
                return res.redirect("/login")
            } else {
                const token = jwt.sign({ id: userData._id }, process.env.JWT_SECRET, { expiresIn: "1d" })
                res.cookie("uid", token, { httpOnly: true, maxAge: 24*60*60*1000 })

                req.flash("flashMessage", ["Login successful !!", "alert-success"])

                return res.status(201).redirect('/admin/dashboard')
            }
        }

    } catch (error) {
        console.log("Error in auth-controller loginPost", error)
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("uid")
        req.flash("flashMessage", ["Logout successful !!", "alert-success", "bg-success"])
        return res.status(200).redirect("/login")
    } catch (error) {
        console.log("Error in auth-controller login", error)
    }
}