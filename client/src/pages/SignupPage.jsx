import { Link, useNavigate } from "react-router-dom"
import SignupForm from "../components/auth/SignupForm"

const SignupPage = () => {
  const navigate = useNavigate()

  const handleSuccess = () => {
    navigate("/login")
  }

  return (
    <div className="page flex justify-center align-center">
      <div className="card max-w-md w-full mx-auto">
        <h1 className="page-title">Create Account</h1>

        <SignupForm onSuccess={handleSuccess} />

        <div className="text-center mt-3">
          <p className="text-gray">
            Already have an account?{" "}
            <Link to="/login" className="text-secondary" style={{ fontWeight: "600" }}>
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignupPage
