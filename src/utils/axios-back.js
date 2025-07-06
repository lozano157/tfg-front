import axios from 'axios'

const axiosBack = axios.create({
    baseURL: import.meta.env.VITE_BASE_APP_URL+'/',
    headers: {
      'Content-Type': 'application/json',
      'appOrigin':'TPSVALENCIA'
    }
  })

  axiosBack.interceptors.request.use(
  (config) => {
    // Get the token from wherever you store it (e.g., localStorage, sessionStorage, etc.)
    const token = JSON.parse(localStorage.getItem('sb-sjobgbzfbmlqikjxwjli-auth-token'))?.access_token; // ⚠️ Replace 'your_token_key'
    // If the token exists, add the Authorization header
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

export default axiosBack

