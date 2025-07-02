"use client"

import { useState } from "react"
import { useAuth } from "../../contexts/AuthContext"

const SignupForm = ({ onSuccess }) => {
  const { signup } = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    const age = Number.parseInt(formData.age)
    if (!formData.age) {
      newErrors.age = "Age is required"
    } else if (isNaN(age) || age < 13 || age > 120) {
      newErrors.age = "Age must be between 13 and 120"
    }

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain at least one letter and one number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    const result = await signup(formData.name.trim(), Number.parseInt(formData.age), formData.email, formData.password)
    setLoading(false)

    if (result.success && onSuccess) {
      onSuccess()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="form-group">
        <label htmlFor="name" className="form-label">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`form-input ${errors.name ? "error" : ""}`}
          aria-required="true"
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name && (
          <div id="name-error" className="form-error" role="alert">
            {errors.name}
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="age" className="form-label">
          Age
        </label>
        <input
          type="number"
          id="age"
          name="age"
          value={formData.age}
          onChange={handleChange}
          className={`form-input ${errors.age ? "error" : ""}`}
          min="13"
          max="120"
          aria-required="true"
          aria-describedby={errors.age ? "age-error" : undefined}
        />
        {errors.age && (
          <div id="age-error" className="form-error" role="alert">
            {errors.age}
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`form-input ${errors.email ? "error" : ""}`}
          aria-required="true"
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <div id="email-error" className="form-error" role="alert">
            {errors.email}
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className={`form-input ${errors.password ? "error" : ""}`}
          aria-required="true"
          aria-describedby={errors.password ? "password-error" : undefined}
        />
        {errors.password && (
          <div id="password-error" className="form-error" role="alert">
            {errors.password}
          </div>
        )}
      </div>

      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={loading}
        aria-label={loading ? "Creating account..." : "Create account"}
      >
        {loading ? <div className="spinner"></div> : "Sign Up"}
      </button>
    </form>
  )
}

export default SignupForm
