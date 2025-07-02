import mongoose from "mongoose"

export async function connectDB() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI environment variable is not set")
    }

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log("MongoDB connected successfully")

    // Create default categories if they don't exist
    await createDefaultCategories()
  } catch (error) {
    console.error("MongoDB connection error:", error)
    process.exit(1)
  }
}

async function createDefaultCategories() {
  try {
    const { default: Category } = await import("../models/Category.js")

    const defaultCategories = [
      { name: "Technology", slug: "technology" },
      { name: "Lifestyle", slug: "lifestyle" },
      { name: "Travel", slug: "travel" },
      { name: "Food", slug: "food" },
      { name: "Health", slug: "health" },
      { name: "Business", slug: "business" },
      { name: "Education", slug: "education" },
      { name: "Entertainment", slug: "entertainment" },
    ]

    for (const categoryData of defaultCategories) {
      const existingCategory = await Category.findOne({ slug: categoryData.slug })
      if (!existingCategory) {
        await Category.create(categoryData)
        console.log(`Created category: ${categoryData.name}`)
      }
    }
  } catch (error) {
    console.error("Error creating default categories:", error)
  }
}
