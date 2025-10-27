import axios from "axios";
import { getCookie } from "../utils/cookie";
import { addHeaderToAxiosConfig } from "../utils/add-header-to-axios-config";

// ✅ Get token from cookies
const { Authorization } = getCookie(["Authorization"]);
addHeaderToAxiosConfig("Authorization", Authorization);

// ✅ Set base URL
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
console.log("axios.defaults.baseURL", axios.defaults.baseURL);

// ✅ Add interceptor for handling token expiry (401)
axios.interceptors.response.use(
  (response) => response, // Pass through successful responses
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("🔒 Token expired or invalid — logging out user...");

      // Remove user data and token
      localStorage.removeItem("user");
      document.cookie =
        "Authorization=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      // Redirect to login page
      window.location.href = "/sign-in";
    }

    return Promise.reject(error);
  }
);

export default axios;
