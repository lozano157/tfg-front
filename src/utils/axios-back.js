import axios from 'axios'

const axiosBack = axios.create({
    baseURL: import.meta.env.VITE_BASE_APP_URL+'/',
    headers: {
      'Content-Type': 'application/json',
      'appOrigin':'TPSVALENCIA'
    }
  })

export default axiosBack