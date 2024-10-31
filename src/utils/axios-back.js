import axios from 'axios'

const axiosApp = axios.create({
    baseURL: import.meta.env.VITE_BASE_APP_URL+'/',
    headers: {
      'Content-Type': 'application/json',
      'appOrigin':'TPSVALENCIABUS'
    }
  })

export default axiosApp