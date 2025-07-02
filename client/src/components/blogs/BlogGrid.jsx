import BlogCard from "./BlogCard"
import "../../styles/BlogCard.css"

const BlogGrid = ({ blogs, loading, showStatus, showActions, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="flex justify-center align-center" style={{ minHeight: "200px" }}>
        <div className="spinner"></div>
      </div>
    )
  }

  if (!blogs || blogs.length === 0) {
    return (
      <div
        className="text-center"
        style={{ minHeight: "200px", display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <div>
          <h3>No blogs found</h3>
          <p className="text-gray">Be the first to create a blog post!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="blog-grid">
      {blogs.map((blog) => (
        <BlogCard
          key={blog._id}
          blog={blog}
          showStatus={showStatus}
          showActions={showActions}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

export default BlogGrid
