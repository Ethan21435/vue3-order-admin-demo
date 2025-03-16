import Mock from 'mockjs'

// 生成订单列表数据
const generateOrders = (params) => {
  const { page = 1, pageSize = 10, orderNo, status, startDate, endDate } = params

  // 生成订单列表
  let list = []
  const total = 100

  for (let i = 0; i < total; i++) {
    const order = Mock.mock({
      id: '@id',
      orderNo: /ORDER-\d{8}-\d{6}/,
      customerName: '@cname',
      phone: /1[3-9]\d{9}/,
      address: '@county(true)',
      amount: '@float(100, 10000, 2, 2)',
      status: '@pick(["pending", "paid", "shipped", "completed"])',
      createTime: '@datetime',
      items: [
        {
          id: '@id',
          name: '@ctitle(4, 8)',
          price: '@float(10, 1000, 2, 2)',
          quantity: '@integer(1, 10)'
        }
      ]
    })
    list.push(order)
  }

  // 根据查询条件过滤
  if (orderNo) {
    list = list.filter(item => item.orderNo.includes(orderNo))
  }
  if (status) {
    list = list.filter(item => item.status === status)
  }
  if (startDate && endDate) {
    list = list.filter(item => {
      const createTime = new Date(item.createTime)
      return createTime >= new Date(startDate) && createTime <= new Date(endDate)
    })
  }

  // 分页
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const pageList = list.slice(start, end)

  return {
    code: 200,
    message: 'success',
    data: {
      list: pageList,
      total: list.length,
      page: Number(page),
      pageSize: Number(pageSize)
    }
  }
}

// 生成订单统计数据
const generateOrderStats = () => {
  const data = Mock.mock({
    totalOrders: '@integer(1000, 10000)',
    totalAmount: '@float(100000, 1000000, 2, 2)',
    pendingOrders: '@integer(10, 100)',
    todayOrders: '@integer(10, 200)',
    'statusDistribution|1': {
      pending: '@integer(10, 100)',
      paid: '@integer(10, 100)',
      shipped: '@integer(10, 100)',
      completed: '@integer(10, 100)'
    },
    recentOrders: {
      'dates|7': ['@date("MM-dd")'],
      'counts|7': ['@integer(10, 100)']
    }
  })

  return {
    code: 200,
    message: 'success',
    data
  }
}

// 设置接口响应延迟
Mock.setup({
  timeout: '200-600'
})

// 定义接口
Mock.mock(/\/api\/orders(\?.+)?$/, 'post', ({ body }) => {
  const params = JSON.parse(body)
  return generateOrders(params)
})

Mock.mock('/api/orders/stats', 'get', generateOrderStats)

export default Mock