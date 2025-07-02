import mongoose from "mongoose"

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      minlength: [50, "Description must be at least 50 characters"],
      maxlength: [10000, "Description cannot exceed 10000 characters"],
    },
    imageUrl: {
      type: String,
      validate: {
        validator: (v) => {
          if (!v) return true
          try {
            new URL(v)
            return true
          } catch {
            return false
          }
        },
        message: "Please enter a valid image URL",
      },
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
    },
    approved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

// Indexes for faster queries
BlogSchema.index({ approved: 1, createdAt: -1 })
BlogSchema.index({ authorId: 1 })
BlogSchema.index({ categoryId: 1 })

export default mongoose.model("Blog", BlogSchema)
