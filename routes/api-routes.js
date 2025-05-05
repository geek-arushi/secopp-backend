import express from 'express'
const apiRoute = express.Router()
import Blog from '../models/blog-model.js'

apiRoute.get("/api/blog", async (req, res) => {
    try {
        const blogs = await Blog.find({}).sort({ createdAt: -1 }).lean();
        res.status(200).json(blogs);
    } catch (error) {
        console.error("Error fetching blogs:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
})

// Get a single blog by ID
apiRoute.get("/api/blog/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const blog = await Blog.findById(id).lean();
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        res.status(200).json(blog);
    } catch (error) {
        console.error("Error fetching blog by ID:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

export default apiRoute