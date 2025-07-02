import User from "../models/User.js"
import Blog from "../models/Blog.js"

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-passwordHash").sort({ createdAt: -1 })

    // Add blog counts for each user
    const usersWithBlogCounts = await Promise.all(
      users.map(async (user) => {
        const totalBlogs = await Blog.countDocuments({ authorId: user._id })
        const approvedBlogs = await Blog.countDocuments({ authorId: user._id, approved: true })

        return {
          ...user.toObject(),
          totalBlogs,
          approvedBlogs,
        }
      }),
    )

    res.json(usersWithBlogCounts)
  } catch (error) {
    next(error)
  }
}

export const getPendingBlogs = async (req, res, next) => {
  try {
    const { approved } = req.query
    const filter = {}

    if (approved !== undefined) {
      filter.approved = approved === "true"
    }

    const blogs = await Blog.find(filter)
      .populate("authorId", "name email")
      .populate("categoryId", "name slug")
      .sort({ createdAt: -1 })

    res.json(blogs)
  } catch (error) {
    next(error)
  }
}

export const approveBlog = async (req, res, next) => {
  try {
    const blogId = req.params.id

    const blog = await Blog.findById(blogId)
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" })
    }

    blog.approved = true
    await blog.save()

    const updatedBlog = await Blog.findById(blogId)
      .populate("authorId", "name email")
      .populate("categoryId", "name slug")

    res.json(updatedBlog)
  } catch (error) {
    next(error)
  }
}

export const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id

    // Prevent admin from deleting themselves
    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot delete your own account" })
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Delete all blogs by this user
    await Blog.deleteMany({ authorId: userId })

    // Delete the user
    await User.findByIdAndDelete(userId)

    res.json({ message: "User and all their blogs deleted successfully" })
  } catch (error) {
    next(error)
  }
}

export const updateUserRole = async (req, res, next) => {
  try {
    const userId = req.params.id
    const { isAdmin } = req.body

    // Prevent admin from changing their own role
    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot change your own admin status" })
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    user.isAdmin = Boolean(isAdmin)
    await user.save()

    const updatedUser = await User.findById(userId).select("-passwordHash")
    res.json(updatedUser)
  } catch (error) {
    next(error)
  }
}

export const deleteBlog = async (req, res, next) => {
  try {
    const blogId = req.params.id

    const blog = await Blog.findById(blogId)
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" })
    }

    await Blog.findByIdAndDelete(blogId)
    res.json({ message: "Blog deleted successfully" })
  } catch (error) {
    next(error)
  }
}
