import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    blogCardTitle: { 
        type: String, 
        required: true
    },
    blogCardDescription: { 
        type: String, 
        required: true
    },
    blogCategory: { 
        type: String, 
        required: true
    },
    blogCardImage: { 
        type: String, 
        required: true
    },
    likes: { 
        type: Number,
        default: 0
    },
    content: { 
        type: String, 
        required: true 
    }
}, { timestamps: true });

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;