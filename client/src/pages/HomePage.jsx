"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import BlogGrid from "../components/blogs/BlogGrid"
import api from "../services/api"
import { toast } from "react-toastify"

const HomePage = () => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetchBlogs()
    fetchCategories()
  }, [])

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      const response = await api.get("/blogs?approved=true")
      setBlogs(response.data)
    } catch (error) {
      toast.error("Failed to load blogs")
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await api.get("/blogs/categories")
      setCategories(response.data)
    } catch (error) {
      console.error("Failed to load categories")
    }
  }

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || blog.categoryId?._id === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="page">
      <div className="container">
        <header className="text-center mb-4">
          <h1 className="page-title">Welcome to The Blog App</h1>
          <p className="text-gray" style={{ fontSize: "1.1rem", maxWidth: "600px", margin: "0 auto" }}>
            Discover amazing stories, insights, and ideas from our community of writers.
          </p>

          <div className="mt-3">
            <Link to="/create-blog" className="btn btn-primary">
              Share Your Story
            </Link>
          </div>
        </header>

        <div className="flex flex-column gap-2 mb-4" style={{ maxWidth: "600px", margin: "0 auto" }}>
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            aria-label="Search blogs"
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="form-input"
            aria-label="Filter by category"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <main>
          <BlogGrid blogs={filteredBlogs} loading={loading} />
        </main>
      </div>
    </div>
  )
}

export default HomePage
