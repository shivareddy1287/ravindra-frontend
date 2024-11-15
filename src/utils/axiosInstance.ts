import axios from "axios"

// Create an instance of axios with default configuration
const axiosInstance = axios.create({
  withCredentials: true, // Ensure cookies are sent with the request
})

export default axiosInstance
