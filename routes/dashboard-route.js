import express from "express";
const dashboardRoute = express.Router()

import { adminDashboard, blogs, viewBlog, editBlog, editBlogPost, deleteBlog, createBlog, createBlogPost } from "../controllers/dashboard-controllers.js";
import { adminAuth } from "../middlewares/auth-middleware.js";

import multer from 'multer'

const storage = multer.diskStorage({})
const upload = multer({
    storage: storage,
    limits: {
        fieldSize: 100 * 1024 * 1024 // 100 MB limit for text fields
      }
})

dashboardRoute.get("/admin/dashboard", adminAuth, adminDashboard)

dashboardRoute.get("/admin/blogs", adminAuth, blogs)

dashboardRoute.get("/admin/blog/:id", adminAuth, viewBlog)

dashboardRoute.get("/admin/edit-blog/:id", adminAuth, editBlog)

dashboardRoute.post("/admin/edit-blog/:id", adminAuth, upload.array('blogCardImage'), editBlogPost)

dashboardRoute.get("/admin/delete-blog/:id", adminAuth, deleteBlog)

dashboardRoute.get("/admin/create-blog", adminAuth, createBlog)
dashboardRoute.post("/admin/create-blog", adminAuth, upload.array('blogCardImage'), createBlogPost)

export default dashboardRoute