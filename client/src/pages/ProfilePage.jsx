"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import BlogGrid from "../components/blogs/BlogGrid"
import api from "../services/api"
import { toast } from "react-toastify"

const ProfilePage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [profileData, setProfileData] = useState({
    name: "",
    age: "",
    profileImageUrl: "",
  })
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        age: user.age || "",
        profileImageUrl: user.profileImageUrl || "",
      })
      fetchUserBlogs()
    }
  }, [user])

  const fetchUserBlogs = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/users/${user.id}/blogs`)
      setBlogs(response.data)
    } catch (error) {
      toast.error("Failed to load your blogs")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (blogId) => {
    navigate(`/edit-blog/${blogId}`)
  }

  const handleDelete = async (blogId) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return

    try {
      await api.delete(`/blogs/${blogId}`)
      setBlogs(blogs.filter((blog) => blog._id !== blogId))
      toast.success("Blog deleted successfully")
    } catch (error) {
      toast.error("Failed to delete blog")
    }
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()

    setSaving(true)
    try {
      const response = await api.put(`/users/${user.id}`, profileData)
      toast.success("Profile updated successfully")
      setEditing(false)

      // Update user in localStorage
      const updatedUser = { ...user, ...response.data }
      localStorage.setItem("user", JSON.stringify(updatedUser))
    } catch (error) {
      toast.error("Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className="page">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div className="card mb-4">
            <div className="flex justify-between align-center mb-3">
              <h1 className="page-title" style={{ marginBottom: 0 }}>
                My Profile
              </h1>
              <button onClick={() => setEditing(!editing)} className="btn btn-secondary">
                {editing ? "Cancel" : "Edit Profile"}
              </button>
            </div>

            {editing ? (
              <form onSubmit={handleProfileUpdate}>
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="age" className="form-label">
                    Age
                  </label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={profileData.age}
                    onChange={handleInputChange}
                    className="form-input"
                    min="13"
                    max="120"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="profileImageUrl" className="form-label">
                    Profile Image URL
                  </label>
                  <input
                    type="url"
                    id="profileImageUrl"
                    name="profileImageUrl"
                    value={profileData.profileImageUrl}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <div className="spinner"></div> : "Save Changes"}
                </button>
              </form>
            ) : (
              <div>
                <div className="flex align-center gap-3 mb-3">
                  {profileData.profileImageUrl && (
                    <img
                      src={profileData.profileImageUrl || "/placeholder.svg"}
                      alt="Profile"
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        e.target.style.display = "none"
                      }}
                    />
                  )}
                  <div>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: "600" }}>{user?.name}</h2>
                    <p className="text-gray">Age: {user?.age}</p>
                    <p className="text-gray">Email: {user?.email}</p>
                    {user?.isAdmin && (
                      <span className="status approved" style={{ fontSize: "0.8rem" }}>
                        Admin
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="card">
            <div className="flex justify-between align-center mb-3">
              <h2 style={{ fontSize: "1.5rem", fontWeight: "600" }}>My Blogs</h2>
              <div className="text-gray">
                {blogs.length} blog{blogs.length !== 1 ? "s" : ""}
              </div>
            </div>

            <BlogGrid
              blogs={blogs}
              loading={loading}
              showStatus={true}
              showActions={true}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
