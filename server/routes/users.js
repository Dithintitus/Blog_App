import express from "express"
import authenticateUser from "../middlewares/authenticateUser.js"
import { getUserBlogs, updateUser, getProfile } from "../controllers/userController.js"

const router = express.Router()

// GET /api/users/profile - Get current user profile
router.get("/profile", authenticateUser, getProfile)

// GET /api/users/:id/blogs - Get user's blogs
router.get("/:id/blogs", authenticateUser, getUserBlogs)

// PUT /api/users/:id - Update user profile
router.put("/:id", authenticateUser, updateUser)

export default router
