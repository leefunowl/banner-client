import axios from "axios"

const API_URL = '/api/auth/'

const register = (username, email, password) => {
  return axios.post(API_URL + "signup", {
    username,
    email,
    password,
  })
}

const login = (para) => {
  return axios.post(API_URL + "signin", para)
}

const logout = () => {
  localStorage.removeItem("user")
}

export default {
  login,
  logout,
  register
}
