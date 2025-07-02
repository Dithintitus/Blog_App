"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import BlogDetail from "../components/blogs/BlogDetail"
import api from "../services/api"
import { toast } from "react-toastify"

const BlogDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBlog()
  }, [id])

  const fetchBlog = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/blogs/${id}`)
      setBlog(response.data)
    } catch (error) {
      toast.error("Failed to load blog")
      navigate("/home")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    navigate(`/edit-blog/${id}`)
  }

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return

    try {
      await api.delete(`/blogs/${id}`)
      toast.success("Blog deleted successfully")
      navigate("/profile")
    } catch (error) {
      toast.error("Failed to delete blog")
    }
  }

  if (loading) {
    return (
      <div className="page flex justify-center align-center">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="page flex justify-center align-center">
        <div className="text-center">
          <h2>Blog not found</h2>
          <button onClick={() => navigate("/home")} className="btn btn-primary mt-2">
            Go Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="container">
        <BlogDetail blog={blog} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
    </div>
  )
}

export default BlogDetailPage
