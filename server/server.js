import express from "express"
import cors from "cors"
import morgan from "morgan"
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"
import { connectDB } from "./utils/db.js"
import authRoutes from "./routes/auth.js"
import blogRoutes from "./routes/blogs.js"
import userRoutes from "./routes/users.js"
import adminRoutes from "./routes/admin.js"
import errorHandler from "./utils/errorHandler.js"

// Load environment variables first
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// Middleware
app.use(cors())
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))
app.use(morgan("dev"))

// Test route to verify server is working
app.get("/", (req, res) => {
  res.json({ message: "Blog App Server is running!" })
})

// Connect to MongoDB
try {
  await connectDB()
} catch (error) {
  console.error("Failed to connect to database:", error)
  process.exit(1)
}

// API Routes
app.use("/api/auth", authRoutes)
app.use("/api/blogs", blogRoutes)
app.use("/api/users", userRoutes)
app.use("/api/admin", adminRoutes)

// Test API route
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!" })
})

// Serve static files from React build (only in production)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")))

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/build", "index.html"))
  })
}

// 404 handler for API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({ message: `API route ${req.originalUrl} not found` })
})

// Error handling middleware
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`)
  console.log(`MongoDB URI: ${process.env.MONGO_URI ? "Set" : "Not set"}`)
  console.log(`JWT Secret: ${process.env.JWT_SECRET ? "Set" : "Not set"}`)
})
