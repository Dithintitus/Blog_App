import express from "express"
import authenticateUser from "../middlewares/authenticateUser.js"
import {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  getCategories,
} from "../controllers/blogController.js"

const router = express.Router()

// GET /api/blogs - Get all blogs (with optional filters)
router.get("/", authenticateUser, getBlogs)

// GET /api/blogs/categories - Get all categories
router.get("/categories", authenticateUser, getCategories)

// GET /api/blogs/:id - Get single blog
router.get("/:id", authenticateUser, getBlogById)

// POST /api/blogs - Create new blog
router.post("/", authenticateUser, createBlog)

// PUT /api/blogs/:id - Update blog
router.put("/:id", authenticateUser, updateBlog)

// DELETE /api/blogs/:id - Delete blog
router.delete("/:id", authenticateUser, deleteBlog)

export default router
