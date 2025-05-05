import express from "express";
const authRoute = express.Router()

import { login, loginPost, logout } from "../controllers/auth-controller.js";

authRoute.get("/login", login)
authRoute.post("/login", loginPost)
authRoute.get("/logout", logout)

export default authRoute