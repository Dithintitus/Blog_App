import { Link, useNavigate } from "react-router-dom"
import LoginForm from "../components/auth/LoginForm"

const LoginPage = () => {
  const navigate = useNavigate()

  const handleSuccess = () => {
    navigate("/home")
  }

  return (
    <div className="page flex justify-center align-center">
      <div className="card max-w-md w-full mx-auto">
        <h1 className="page-title">Welcome Back</h1>

        <LoginForm onSuccess={handleSuccess} />

        <div className="text-center mt-3">
          <p className="text-gray">
            Don't have an account?{" "}
            <Link to="/signup" className="text-secondary" style={{ fontWeight: "600" }}>
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
