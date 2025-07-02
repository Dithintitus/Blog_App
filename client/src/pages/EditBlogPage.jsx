"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import BlogForm from "../components/blogs/BlogForm"
import api from "../services/api"
import { toast } from "react-toastify"

const EditBlogPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)

  useEffect(() => {
    fetchBlog()
  }, [id])

  const fetchBlog = async () => {
    try {
      setPageLoading(true)
      const response = await api.get(`/blogs/${id}`)
      setBlog(response.data)
    } catch (error) {
      toast.error("Failed to load blog")
      navigate("/profile")
    } finally {
      setPageLoading(false)
    }
  }

  const handleSubmit = async (formData) => {
    setLoading(true)
    try {
      await api.put(`/blogs/${id}`, formData)
      toast.success("Blog updated successfully!")
      navigate(`/blogs/${id}`)
    } catch (error) {
      toast.error("Failed to update blog")
    } finally {
      setLoading(false)
    }
  }

  if (pageLoading) {
    return (
      <div className="page flex justify-center align-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Edit Blog</h1>

        <div className="card">
          <BlogForm blog={blog} onSubmit={handleSubmit} loading={loading} />
        </div>
      </div>
    </div>
  )
}

export default EditBlogPage
