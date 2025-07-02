"use client"
import { useAuth } from "../../contexts/AuthContext"

const BlogDetail = ({ blog, onEdit, onDelete }) => {
  const { user } = useAuth()

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const canEdit = user && (user.id === blog.authorId?._id || user.isAdmin)
  const canDelete = user && (user.id === blog.authorId?._id || user.isAdmin)

  return (
    <article className="card max-w-4xl mx-auto">
      {blog.imageUrl && (
        <img
          src={blog.imageUrl || "/placeholder.svg"}
          alt={blog.title}
          style={{
            width: "100%",
            height: "300px",
            objectFit: "cover",
            borderRadius: "var(--radius-card)",
            marginBottom: "1.5rem",
          }}
          onError={(e) => {
            e.target.src = "/placeholder.svg?height=300&width=800"
          }}
        />
      )}

      <header className="mb-3">
        <h1 style={{ fontSize: "2.5rem", fontWeight: "700", marginBottom: "1rem" }}>{blog.title}</h1>

        <div className="flex justify-between align-center mb-2">
          <div>
            <p className="text-gray">
              By <strong>{blog.authorId?.name || "Unknown Author"}</strong>
            </p>
            <p className="text-gray" style={{ fontSize: "0.9rem" }}>
              Published on {formatDate(blog.createdAt)}
            </p>
          </div>

          {!blog.approved && (
            <span
              className="status pending"
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "var(--radius-pill)",
                background: "var(--color-primary)",
                fontSize: "0.8rem",
                fontWeight: "600",
              }}
            >
              Pending Approval
            </span>
          )}
        </div>

        {(canEdit || canDelete) && (
          <div className="flex gap-2 mt-2">
            {canEdit && (
              <button onClick={onEdit} className="btn btn-secondary">
                Edit Blog
              </button>
            )}
            {canDelete && (
              <button onClick={onDelete} className="btn btn-danger">
                Delete Blog
              </button>
            )}
          </div>
        )}
      </header>

      <div
        style={{
          fontSize: "1.1rem",
          lineHeight: "1.8",
          whiteSpace: "pre-wrap",
          marginTop: "2rem",
        }}
      >
        {blog.description}
      </div>

      {blog.categoryId && (
        <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--color-light-gray)" }}>
          <span className="text-gray">Category: </span>
          <span
            style={{
              background: "var(--color-light-gray)",
              padding: "0.25rem 0.75rem",
              borderRadius: "var(--radius-pill)",
              fontSize: "0.9rem",
            }}
          >
            {blog.categoryId.name}
          </span>
        </div>
      )}
    </article>
  )
}

export default BlogDetail
