import api from "./api"

export const login = (email, password) => {
  return api.post("/auth/login", { email, password })
}

export const signup = (name, age, email, password) => {
  return api.post("/auth/signup", { name, age, email, password })
}

export const getProfile = () => {
  return api.get("/users/profile")
}

export const updateProfile = (data) => {
  return api.put("/users/profile", data)
}
