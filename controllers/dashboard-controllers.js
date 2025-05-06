import User from "../models/user-model.js"
import Blog from "../models/blog-model.js"
import { uploadFile, extractImageURLs, deleteImageFromCloudinary, deleteCloudinaryImages } from "../utils/imageUpload.js";


export const adminDashboard = async (req, res) => {
    try {
        const userData = await User.findById(req.id).select('-password');
        // Fetch all blogs
        const blogs = await Blog.find({}).sort({ createdAt: -1 }).lean();

        // Count total blogs
        const totalBlogs = blogs.length;

        // Count specific categories
        const cancerBlogs = blogs.filter(blog => blog.blogCategory.toLowerCase() === "cancer").length;
        const orthopedicBlogs = blogs.filter(blog => blog.blogCategory.toLowerCase() === "orthopedic").length;

        res.status(200).render("adminDashboard", { title: "Admin Dashboard || Second Opinion - Health & Secopp", message: req.flash("flashMessage"), userData, totalBlogs, cancerBlogs, orthopedicBlogs })
    } catch (error) {
        console.log("Error in dashboard-controller adminDashboard", error)
    }
}

export const blogs = async (req, res) => {
    try {
        const userData = await User.findById(req.id).select('-password');

        const allBlogs = await Blog.find({}).sort({ createdAt: -1 }).lean()

        res.status(200).render("blogs", { title: "All Blog || Second Opinion - Health & Secopp", message: req.flash("flashMessage"), userData, allBlogs })
    } catch (error) {
        console.log("Error in dashboard-controller blogs", error)
    }
}

export const viewBlog = async (req, res) => {
    try {
        const id = req.params.id
        const userData = await User.findById(req.id).select('-password');

        const blog = await Blog.findById(id).lean();

        res.status(200).render("view-blog", { title: blog.blogCardTitle, message: req.flash("flashMessage"), userData, blog })
    } catch (error) {
        console.log("Error in dashboard-controller viewBlog", error)
    }
}

export const editBlog = async (req, res) => {
    try {
        const id = req.params.id
        const userData = await User.findById(req.id).select('-password');

        const blog = await Blog.findById(id).lean();


        if (!blog) {
            req.flash("flashMessage", ["Blog not found", "alert-danger"]);
            return res.status(404).redirect("/admin/blogs");
        }

        res.status(200).render("edit-blog", { title: `Edit ${blog.blogCardTitle}`, message: req.flash("flashMessage"), userData, blog })
    } catch (error) {
        console.log("Error in dashboard-controller editBlog", error)
    }
}

export const editBlogPost = async (req, res) => {
    try {
        const { blogCardTitle, blogCardDescription, blogCategory, content } = req.body;
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            req.flash("flashMessage", ["Blog not found", "alert-danger"]);
            return res.status(404).redirect("/admin/blogs");
        }

        const oldImageURLs = extractImageURLs(blog.content || "");
        const newImageURLs = extractImageURLs(content);

        const removedImages = oldImageURLs.filter(url => !newImageURLs.includes(url));

        await deleteCloudinaryImages(removedImages);

        blog.blogCardTitle = blogCardTitle;
        blog.blogCardDescription = blogCardDescription;
        blog.blogCategory = blogCategory;
        blog.content = content;

        if (req.files && req.files.length > 0) {
            await deleteImageFromCloudinary(blog.blogCardImage);
            const image = req.files
            const uploadedImageURL = await uploadFile(image[0].path)
            const blogCardImage = uploadedImageURL.secure_url
            blog.blogCardImage = blogCardImage;
        }

        await blog.save();
        req.flash("flashMessage", ["Blog Updated Successfully !!", "alert-success"])
        return res.status(201).redirect("/admin/blogs")

    } catch (error) {
        console.log("Error in dashboard-controller editBlogPost", error)
    }
}

export const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            req.flash("flashMessage", ["Blog not found", "alert-danger"]);
            return res.status(404).redirect("/admin/blogs");
        }

        // 1. Delete blogCardImage from Cloudinary
        if (blog.blogCardImage) {
            await deleteImageFromCloudinary(blog.blogCardImage);
        }

        // 2. Extract and delete images from blog.content
        const contentImageURLs = extractImageURLs(blog.content || "");
        await deleteCloudinaryImages(contentImageURLs);

        // 3. Delete blog from database
        await blog.deleteOne();

        req.flash("flashMessage", ["Blog deleted successfully", "alert-success"]);
        return res.status(200).redirect("/admin/blogs");

    } catch (error) {
        console.log("Error in dashboard-controller deleteBlog", error)
    }
}

export const createBlog = async (req, res) => {
    try {
        const userData = await User.findById(req.id).select('-password');

        const allUsers = await User.find({ role: { $ne: "Admin" } }).select('-password').sort({ createdAt: -1 }).lean()
        res.status(200).render("create-blog", { title: "Create Blog || Second Opinion - Health & Secopp", message: req.flash("flashMessage"), userData, allUsers })
    } catch (error) {
        console.log("Error in dashboard-controller createBlog", error)
    }
}

export const createBlogPost = async (req, res) => {
    try {
        const { blogCardTitle, blogCardDescription, blogCategory, content } = req.body;

        const image = req.files
        const uploadedImageURL = await uploadFile(image[0].path)
        const blogCardImage = uploadedImageURL.secure_url

        const blog = new Blog({ blogCardTitle, blogCardDescription, blogCategory, blogCardImage, content });
        await blog.save();

        req.flash("flashMessage", ["Blog Created Successfully !!", "alert-success"])

        return res.status(201).redirect("/admin/create-blog")

    } catch (error) {
        console.log("Error in dashboard-controller createBlogPost", error)
    }
}