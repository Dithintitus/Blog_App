"use client"

import { useState, useEffect } from "react"
import api from "../../services/api"
import { toast } from "react-toastify"

const BlogForm = ({ blog, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    categoryId: "",
  })
  const [errors, setErrors] = useState({})
  const [categories, setCategories] = useState([])
  const [imagePreview, setImagePreview] = useState("")

  useEffect(() => {
    fetchCategories()

    if (blog) {
      setFormData({
        title: blog.title || "",
        description: blog.description || "",
        imageUrl: blog.imageUrl || "",
        categoryId: blog.categoryId?._id || "",
      })
      setImagePreview(blog.imageUrl || "")
    }
  }, [blog])

  const fetchCategories = async () => {
    try {
      const response = await api.get("/blogs/categories")
      setCategories(response.data)
    } catch (error) {
      toast.error("Failed to load categories")
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    } else if (formData.description.trim().length < 50) {
      newErrors.description = "Description must be at least 50 characters"
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Category is required"
    }

    if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
      newErrors.imageUrl = "Please enter a valid image URL"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }

    // Update image preview
    if (name === "imageUrl" && value && isValidUrl(value)) {
      setImagePreview(value)
    } else if (name === "imageUrl" && !value) {
      setImagePreview("")
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) return

    const submitData = {
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      imageUrl: formData.imageUrl.trim() || undefined,
    }

    onSubmit(submitData)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <div className="form-group">
        <label htmlFor="title" className="form-label">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`form-input ${errors.title ? "error" : ""}`}
          aria-required="true"
          aria-describedby={errors.title ? "title-error" : undefined}
        />
        {errors.title && (
          <div id="title-error" className="form-error" role="alert">
            {errors.title}
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="categoryId" className="form-label">
          Category
        </label>
        <select
          id="categoryId"
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          className={`form-input ${errors.categoryId ? "error" : ""}`}
          aria-required="true"
          aria-describedby={errors.categoryId ? "category-error" : undefined}
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <div id="category-error" className="form-error" role="alert">
            {errors.categoryId}
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="imageUrl" className="form-label">
          Image URL (optional)
        </label>
        <input
          type="url"
          id="imageUrl"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          className={`form-input ${errors.imageUrl ? "error" : ""}`}
          placeholder="https://example.com/image.jpg"
          aria-describedby={errors.imageUrl ? "image-error" : undefined}
        />
        {errors.imageUrl && (
          <div id="image-error" className="form-error" role="alert">
            {errors.imageUrl}
          </div>
        )}

        {imagePreview && (
          <div className="mt-2">
            <img
              src={imagePreview || "/placeholder.svg"}
              alt="Preview"
              style={{
                maxWidth: "100%",
                height: "200px",
                objectFit: "cover",
                borderRadius: "var(--radius-card)",
              }}
              onError={() => setImagePreview("")}
            />
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="description" className="form-label">
          Description
          <span className="text-gray" style={{ fontSize: "0.9rem", fontWeight: "normal" }}>
            ({formData.description.length}/50 minimum)
          </span>
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className={`form-input form-textarea ${errors.description ? "error" : ""}`}
          rows="8"
          aria-required="true"
          aria-describedby={errors.description ? "description-error" : undefined}
        />
        {errors.description && (
          <div id="description-error" className="form-error" role="alert">
            {errors.description}
          </div>
        )}
      </div>

      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={loading}
        aria-label={loading ? "Saving..." : blog ? "Update blog" : "Create blog"}
      >
        {loading ? <div className="spinner"></div> : blog ? "Update Blog" : "Create Blog"}
      </button>
    </form>
  )
}

export default BlogForm
