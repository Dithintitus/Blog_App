import Blog from "../models/Blog.js"
import Category from "../models/Category.js"

export const getBlogs = async (req, res, next) => {
  try {
    const { approved, categoryId, authorId } = req.query
    const filter = {}

    if (approved !== undefined) {
      filter.approved = approved === "true"
    }

    if (categoryId) {
      filter.categoryId = categoryId
    }

    if (authorId) {
      filter.authorId = authorId
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

export const getBlogById = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("authorId", "name email")
      .populate("categoryId", "name slug")

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" })
    }

    res.json(blog)
  } catch (error) {
    next(error)
  }
}

export const createBlog = async (req, res, next) => {
  try {
    const { title, description, imageUrl, categoryId } = req.body

    // Validation
    if (!title || !description || !categoryId) {
      return res.status(400).json({ message: "Title, description, and category are required" })
    }

    if (description.length < 50) {
      return res.status(400).json({ message: "Description must be at least 50 characters long" })
    }

    // Verify category exists
    const category = await Category.findById(categoryId)
    if (!category) {
      return res.status(400).json({ message: "Invalid category" })
    }

    const blog = new Blog({
      title: title.trim(),
      description: description.trim(),
      imageUrl: imageUrl?.trim(),
      categoryId,
      authorId: req.user._id,
      approved: false,
    })

    await blog.save()

    const populatedBlog = await Blog.findById(blog._id)
      .populate("authorId", "name email")
      .populate("categoryId", "name slug")

    res.status(201).json(populatedBlog)
  } catch (error) {
    next(error)
  }
}

export const updateBlog = async (req, res, next) => {
  try {
    const { title, description, imageUrl, categoryId } = req.body
    const blogId = req.params.id

    const blog = await Blog.findById(blogId)
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" })
    }

    // Check if user owns the blog or is admin
    if (blog.authorId.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized to update this blog" })
    }

    // Validation
    if (title !== undefined && !title.trim()) {
      return res.status(400).json({ message: "Title cannot be empty" })
    }

    if (description !== undefined && description.trim().length < 50) {
      return res.status(400).json({ message: "Description must be at least 50 characters long" })
    }

    if (categoryId) {
      const category = await Category.findById(categoryId)
      if (!category) {
        return res.status(400).json({ message: "Invalid category" })
      }
    }

    // Update fields
    if (title !== undefined) blog.title = title.trim()
    if (description !== undefined) blog.description = description.trim()
    if (imageUrl !== undefined) blog.imageUrl = imageUrl.trim() || undefined
    if (categoryId !== undefined) blog.categoryId = categoryId

    // Reset approval status if content changed (unless admin is updating)
    if (!req.user.isAdmin && (title !== undefined || description !== undefined || imageUrl !== undefined)) {
      blog.approved = false
    }

    await blog.save()

    const updatedBlog = await Blog.findById(blog._id)
      .populate("authorId", "name email")
      .populate("categoryId", "name slug")

    res.json(updatedBlog)
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

    // Check if user owns the blog or is admin
    if (blog.authorId.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized to delete this blog" })
    }

    await Blog.findByIdAndDelete(blogId)
    res.json({ message: "Blog deleted successfully" })
  } catch (error) {
    next(error)
  }
}

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 })
    res.json(categories)
  } catch (error) {
    next(error)
  }
}
