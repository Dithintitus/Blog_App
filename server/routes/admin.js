import express from "express"
import authenticateUser from "../middlewares/authenticateUser.js"
import authorizeAdmin from "../middlewares/authorizeAdmin.js"
import {
  getUsers,
  getPendingBlogs,
  approveBlog,
  deleteUser,
  updateUserRole,
  deleteBlog,
} from "../controllers/adminController.js"

const router = express.Router()

// Apply authentication and admin authorization to all routes
router.use(authenticateUser)
router.use(authorizeAdmin)

// GET /api/admin/users - Get all users
router.get("/users", getUsers)

// GET /api/admin/blogs - Get blogs (with optional filters)
router.get("/blogs", getPendingBlogs)

// PUT /api/admin/blogs/:id/approve - Approve blog
router.put("/blogs/:id/approve", approveBlog)

// DELETE /api/admin/blogs/:id - Delete any blog
router.delete("/blogs/:id", deleteBlog)

// DELETE /api/admin/users/:id - Delete user
router.delete("/users/:id", deleteUser)

// PUT /api/admin/users/:id/role - Update user role
router.put("/users/:id/role", updateUserRole)

export default router
