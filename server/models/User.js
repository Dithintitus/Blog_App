import mongoose from "mongoose"

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [13, "Age must be at least 13"],
      max: [120, "Age cannot exceed 120"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    passwordHash: {
      type: String,
      required: [true, "Password is required"],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    profileImageUrl: {
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
        message: "Please enter a valid URL",
      },
    },
  },
  {
    timestamps: true,
  },
)

// Index for faster queries
UserSchema.index({ email: 1 })

export default mongoose.model("User", UserSchema)
