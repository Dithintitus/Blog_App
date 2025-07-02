"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import "../../styles/Navbar.css"

const Navbar = () => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    logout()
    setMobileMenuOpen(false)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  if (!user) {
    return (
      <nav className="navbar">
        <Link to="/" className="logo">
          The Blog App
        </Link>
        <div className="nav-links">
          <Link to="/login" className={`nav-link ${isActive("/login") ? "active" : ""}`}>
            Login
          </Link>
          <Link to="/signup" className={`nav-link ${isActive("/signup") ? "active" : ""}`}>
            Sign Up
          </Link>
        </div>
      </nav>
    )
  }

  return (
    <nav className="navbar">
      <Link to="/home" className="logo">
        The Blog App
      </Link>

      <div className="nav-links">
        <Link to="/home" className={`nav-link ${isActive("/home") ? "active" : ""}`}>
          Home
        </Link>
        <Link to="/create-blog" className={`nav-link ${isActive("/create-blog") ? "active" : ""}`}>
          Create Blog
        </Link>
        <Link to="/profile" className={`nav-link ${isActive("/profile") ? "active" : ""}`}>
          Profile
        </Link>
        {user.isAdmin && (
          <Link to="/admin/dashboard" className={`nav-link ${isActive("/admin/dashboard") ? "active" : ""}`}>
            Admin
          </Link>
        )}
        <button onClick={handleLogout} className="btn">
          Logout
        </button>
      </div>

      <div className="hamburger" onClick={toggleMobileMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`}>
        <Link
          to="/home"
          className={`nav-link ${isActive("/home") ? "active" : ""}`}
          onClick={() => setMobileMenuOpen(false)}
        >
          Home
        </Link>
        <Link
          to="/create-blog"
          className={`nav-link ${isActive("/create-blog") ? "active" : ""}`}
          onClick={() => setMobileMenuOpen(false)}
        >
          Create Blog
        </Link>
        <Link
          to="/profile"
          className={`nav-link ${isActive("/profile") ? "active" : ""}`}
          onClick={() => setMobileMenuOpen(false)}
        >
          Profile
        </Link>
        {user.isAdmin && (
          <Link
            to="/admin/dashboard"
            className={`nav-link ${isActive("/admin/dashboard") ? "active" : ""}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Admin
          </Link>
        )}
        <button onClick={handleLogout} className="btn">
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar
