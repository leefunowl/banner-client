import axios from "axios"
import authHeader from "./auth-header"

const API_URL = '/api/lsd/'

// Primary lsd tables
const getAll = () => {
  return axios.get(API_URL + "all", { headers: authHeader()})
}

const search = (para) => {
  return axios.post(API_URL + "search", para, { headers: authHeader() })
}

const fetch = (args) => {
  return axios.post(API_URL + "fetch", args, { headers: authHeader() })
}

const insertRows = (args) => {
  return axios.post(API_URL + "insert", args, { headers: authHeader() })
}

const updateRows = (args) => {
  return axios.post(API_URL + "update", args, { headers: authHeader() })
}

const removeRows = (args) => {
  return axios.delete(API_URL + "remove", { headers: authHeader(), data: args })
}

// Secondary lsd tables
const fetchSecTs = (args) => {
  return axios.post(API_URL + "fetchSecTs", args, { headers: authHeader() })
}

export default {
  getAll,
  search,
  fetch,
  insertRows,
  updateRows,
  removeRows,
  fetchSecTs
}
