import axios from 'axios'

const instance = axios.create({
  baseURL: '/api',
  timeout: 5000
})

// 请求拦截器
instance.interceptors.request.use(
  config => {
    // 在这里可以添加认证信息等
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  response => {
    const { code, message, data } = response.data
    if (code === 200) {
      return { data }
    }
    return Promise.reject(new Error(message || '请求失败'))
  },
  error => {
    return Promise.reject(error)
  }
)

// 获取订单列表
export const getOrders = (params) => {
  return instance.post('/orders', params)
}

// 获取订单统计数据
export const getOrderStats = () => {
  return instance.get('/orders/stats')
}