import User from "../models/User.js"
import Blog from "../models/Blog.js"

export const getUserBlogs = async (req, res, next) => {
  try {
    const userId = req.params.id

    // Check if user is requesting their own blogs or is admin
    if (userId !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized to view these blogs" })
    }

    const blogs = await Blog.find({ authorId: userId })
      .populate("authorId", "name email")
      .populate("categoryId", "name slug")
      .sort({ createdAt: -1 })

    res.json(blogs)
  } catch (error) {
    next(error)
  }
}

export const updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id
    const { name, age, profileImageUrl } = req.body

    // Check if user is updating their own profile or is admin
    if (userId !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized to update this profile" })
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Validation
    if (name !== undefined && !name.trim()) {
      return res.status(400).json({ message: "Name cannot be empty" })
    }

    if (age !== undefined) {
      const ageNum = Number.parseInt(age)
      if (isNaN(ageNum) || ageNum < 13 || ageNum > 120) {
        return res.status(400).json({ message: "Age must be between 13 and 120" })
      }
    }

    // Update fields
    if (name !== undefined) user.name = name.trim()
    if (age !== undefined) user.age = Number.parseInt(age)
    if (profileImageUrl !== undefined) user.profileImageUrl = profileImageUrl.trim() || undefined

    await user.save()

    // Return updated user data (excluding password)
    const updatedUser = await User.findById(userId).select("-passwordHash")
    res.json(updatedUser)
  } catch (error) {
    next(error)
  }
}

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-passwordHash")
    res.json(user)
  } catch (error) {
    next(error)
  }
}
