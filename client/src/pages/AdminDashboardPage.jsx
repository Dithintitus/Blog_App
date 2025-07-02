"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"
import { toast } from "react-toastify"

const AdminDashboardPage = () => {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [pendingBlogs, setPendingBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("users")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [usersResponse, blogsResponse] = await Promise.all([
        api.get("/admin/users"),
        api.get("/admin/blogs?approved=false"),
      ])
      setUsers(usersResponse.data)
      setPendingBlogs(blogsResponse.data)
    } catch (error) {
      toast.error("Failed to load admin data")
    } finally {
      setLoading(false)
    }
  }

  const handleApproveBlog = async (blogId) => {
    try {
      await api.put(`/admin/blogs/${blogId}/approve`)
      setPendingBlogs(pendingBlogs.filter((blog) => blog._id !== blogId))
      toast.success("Blog approved successfully")
    } catch (error) {
      toast.error("Failed to approve blog")
    }
  }

  const handleDeleteBlog = async (blogId) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return

    try {
      await api.delete(`/admin/blogs/${blogId}`)
      setPendingBlogs(pendingBlogs.filter((blog) => blog._id !== blogId))
      toast.success("Blog deleted successfully")
    } catch (error) {
      toast.error("Failed to delete blog")
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user? This will also delete all their blogs.")) return

    try {
      await api.delete(`/admin/users/${userId}`)
      setUsers(users.filter((user) => user._id !== userId))
      toast.success("User deleted successfully")
    } catch (error) {
      toast.error("Failed to delete user")
    }
  }

  const handleToggleAdmin = async (userId, isAdmin) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { isAdmin: !isAdmin })
      setUsers(users.map((user) => (user._id === userId ? { ...user, isAdmin: !isAdmin } : user)))
      toast.success(`User ${!isAdmin ? "promoted to" : "removed from"} admin successfully`)
    } catch (error) {
      toast.error("Failed to update user role")
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="page flex justify-center align-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Admin Dashboard</h1>

        <div className="card mb-4">
          <div className="flex gap-2 mb-3">
            <button onClick={() => setActiveTab("users")} className={`btn ${activeTab === "users" ? "active" : ""}`}>
              Users ({users.length})
            </button>
            <button onClick={() => setActiveTab("blogs")} className={`btn ${activeTab === "blogs" ? "active" : ""}`}>
              Pending Blogs ({pendingBlogs.length})
            </button>
          </div>

          {activeTab === "users" && (
            <div>
              <h2 className="mb-3" style={{ fontSize: "1.25rem", fontWeight: "600" }}>
                User Management
              </h2>

              {users.length === 0 ? (
                <p className="text-gray">No users found.</p>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: "2px solid var(--color-light-gray)" }}>
                        <th style={{ padding: "1rem", textAlign: "left" }}>Name</th>
                        <th style={{ padding: "1rem", textAlign: "left" }}>Email</th>
                        <th style={{ padding: "1rem", textAlign: "left" }}>Age</th>
                        <th style={{ padding: "1rem", textAlign: "left" }}>Role</th>
                        <th style={{ padding: "1rem", textAlign: "left" }}>Blogs</th>
                        <th style={{ padding: "1rem", textAlign: "left" }}>Joined</th>
                        <th style={{ padding: "1rem", textAlign: "left" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user._id} style={{ borderBottom: "1px solid var(--color-light-gray)" }}>
                          <td style={{ padding: "1rem" }}>{user.name}</td>
                          <td style={{ padding: "1rem" }}>{user.email}</td>
                          <td style={{ padding: "1rem" }}>{user.age}</td>
                          <td style={{ padding: "1rem" }}>
                            <span className={`status ${user.isAdmin ? "approved" : "pending"}`}>
                              {user.isAdmin ? "Admin" : "User"}
                            </span>
                          </td>
                          <td style={{ padding: "1rem" }}>
                            {user.totalBlogs || 0} ({user.approvedBlogs || 0} approved)
                          </td>
                          <td style={{ padding: "1rem" }}>{formatDate(user.createdAt)}</td>
                          <td style={{ padding: "1rem" }}>
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleToggleAdmin(user._id, user.isAdmin)}
                                className="btn btn-secondary"
                                style={{ padding: "0.25rem 0.5rem", fontSize: "0.8rem" }}
                              >
                                {user.isAdmin ? "Remove Admin" : "Make Admin"}
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user._id)}
                                className="btn btn-danger"
                                style={{ padding: "0.25rem 0.5rem", fontSize: "0.8rem" }}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "blogs" && (
            <div>
              <h2 className="mb-3" style={{ fontSize: "1.25rem", fontWeight: "600" }}>
                Pending Blog Approvals
              </h2>

              {pendingBlogs.length === 0 ? (
                <p className="text-gray">No pending blogs.</p>
              ) : (
                <div className="blog-grid">
                  {pendingBlogs.map((blog) => (
                    <div key={blog._id} className="blog-card">
                      {blog.imageUrl && (
                        <img
                          src={blog.imageUrl || "/placeholder.svg"}
                          alt={blog.title}
                          onError={(e) => {
                            e.target.src = "/placeholder.svg?height=200&width=300"
                          }}
                        />
                      )}

                      <div className="content">
                        <h3 className="title">{blog.title}</h3>
                        <p className="description">{blog.description}</p>

                        <div className="meta">
                          <div>
                            <div className="author">By {blog.authorId?.name || "Unknown"}</div>
                            <div className="date">{formatDate(blog.createdAt)}</div>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => navigate(`/blogs/${blog._id}`)}
                            className="btn"
                            style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleApproveBlog(blog._id)}
                            className="btn btn-secondary"
                            style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleDeleteBlog(blog._id)}
                            className="btn btn-danger"
                            style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardPage
