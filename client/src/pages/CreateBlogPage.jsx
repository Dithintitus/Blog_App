"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import BlogForm from "../components/blogs/BlogForm"
import api from "../services/api"
import { toast } from "react-toastify"

const CreateBlogPage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (formData) => {
    setLoading(true)
    try {
      const response = await api.post("/blogs", formData)
      toast.success("Blog created successfully! It will be visible once approved.")
      navigate(`/blogs/${response.data._id}`)
    } catch (error) {
      toast.error("Failed to create blog")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Create New Blog</h1>

        <div className="card">
          <BlogForm onSubmit={handleSubmit} loading={loading} />
        </div>
      </div>
    </div>
  )
}

export default CreateBlogPage
