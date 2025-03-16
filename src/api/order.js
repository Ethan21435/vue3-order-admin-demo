import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 5000
})

// 请求拦截器
api.interceptors.request.use(
  config => {
    // 可以在这里添加token等认证信息
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  response => {
    const { code, data, message } = response.data
    if (code === 200) {
      return data
    }
    ElMessage.error(message || '请求失败')
    return Promise.reject(new Error(message || '请求失败'))
  },
  error => {
    ElMessage.error(error.message || '请求失败')
    return Promise.reject(error)
  }
)

export const getOrders = (params) => {
  return api.post('/orders', params)
}

export const getOrderStats = () => {
  return api.get('/orders/stats')
}

export default api