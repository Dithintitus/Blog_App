"use client"
import { useNavigate } from "react-router-dom"
import "../../styles/BlogCard.css"

const BlogCard = ({ blog, showStatus = false, showActions = false, onEdit, onDelete }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/blogs/${blog._id}`)
  }

  const handleEdit = (e) => {
    e.stopPropagation()
    onEdit(blog._id)
  }

  const handleDelete = (e) => {
    e.stopPropagation()
    onDelete(blog._id)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="blog-card" onClick={handleClick} role="button" tabIndex={0}>
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

          <div className="flex align-center gap-1">
            {showStatus && (
              <span className={`status ${blog.approved ? "approved" : "pending"}`}>
                {blog.approved ? "Approved" : "Pending"}
              </span>
            )}

            {showActions && (
              <div className="flex gap-1">
                <button
                  onClick={handleEdit}
                  className="btn btn-secondary"
                  style={{ padding: "0.25rem 0.5rem", fontSize: "0.8rem" }}
                  aria-label={`Edit ${blog.title}`}
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="btn btn-danger"
                  style={{ padding: "0.25rem 0.5rem", fontSize: "0.8rem" }}
                  aria-label={`Delete ${blog.title}`}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogCard
