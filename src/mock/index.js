import Mock from 'mockjs'

const Random = Mock.Random

// 生成订单列表
const generateOrders = (params) => {
  const { page = 1, pageSize = 10, orderNo, status, dateRange } = JSON.parse(params.body)
  
  let list = []
  const total = 100
  
  for (let i = 0; i < pageSize; i++) {
    const order = {
      id: Random.id(),
      orderNo: Random.string('upper', 10),
      customerName: Random.cname(),
      phone: Random.string('number', 11),
      address: Random.county(true),
      amount: Random.float(100, 10000, 2, 2),
      status: Random.pick(['pending', 'paid', 'shipped', 'completed']),
      createTime: Random.datetime('yyyy-MM-dd HH:mm:ss'),
      items: []
    }
    
    // 生成订单商品
    const itemCount = Random.integer(1, 5)
    for (let j = 0; j < itemCount; j++) {
      order.items.push({
        id: Random.id(),
        productName: Random.ctitle(3, 7),
        price: Random.float(10, 1000, 2, 2),
        quantity: Random.integer(1, 10)
      })
    }
    
    list.push(order)
  }
  
  // 筛选
  if (orderNo) {
    list = list.filter(item => item.orderNo.includes(orderNo))
  }
  if (status) {
    list = list.filter(item => item.status === status)
  }
  if (dateRange && dateRange.length === 2) {
    list = list.filter(item => {
      const createTime = new Date(item.createTime).getTime()
      return createTime >= new Date(dateRange[0]).getTime() && 
             createTime <= new Date(dateRange[1]).getTime()
    })
  }

  return {
    code: 200,
    data: {
      list,
      total,
      page: Number(page),
      pageSize: Number(pageSize)
    }
  }
}

// 获取订单统计数据
const getOrderStats = () => {
  return {
    code: 200,
    data: {
      totalOrders: Random.integer(1000, 10000),
      totalAmount: Random.float(10000, 1000000, 2, 2),
      statusDistribution: {
        pending: Random.integer(10, 100),
        paid: Random.integer(10, 100),
        shipped: Random.integer(10, 100),
        completed: Random.integer(10, 100)
      },
      recentOrders: Array(7).fill(0).map((_, index) => ({
        date: Random.date('yyyy-MM-dd'),
        count: Random.integer(10, 100),
        amount: Random.float(1000, 10000, 2, 2)
      }))
    }
  }
}

// 模拟接口
Mock.mock(/\/api\/orders\/?(\?.*)?$/, 'post', generateOrders)
Mock.mock('/api/orders/stats', 'get', getOrderStats)

export default Mock