<template>
  <div class="order-detail">
    <div class="page-header">
      <el-page-header @back="goBack">
        <template #content>订单详情</template>
      </el-page-header>
    </div>

    <el-card class="detail-card">
      <template #header>
        <div class="card-header">
          <span>基本信息</span>
        </div>
      </template>
      
      <el-descriptions :column="2" border>
        <el-descriptions-item label="订单号">{{ orderDetail.orderNo }}</el-descriptions-item>
        <el-descriptions-item label="订单状态">
          <el-tag :type="getStatusType(orderDetail.status)">
            {{ getStatusText(orderDetail.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="客户名称">{{ orderDetail.customerName }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ orderDetail.phone }}</el-descriptions-item>
        <el-descriptions-item label="收货地址">{{ orderDetail.address }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ orderDetail.createTime }}</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card class="detail-card">
      <template #header>
        <div class="card-header">
          <span>商品信息</span>
        </div>
      </template>

      <el-table :data="orderDetail.items" style="width: 100%">
        <el-table-column prop="productName" label="商品名称" />
        <el-table-column prop="price" label="单价">
          <template #default="scope">
            ¥{{ scope.row.price.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="数量" width="120" />
        <el-table-column label="小计">
          <template #default="scope">
            ¥{{ (scope.row.price * scope.row.quantity).toFixed(2) }}
          </template>
        </el-table-column>
      </el-table>

      <div class="order-total">
        <span>订单总额：</span>
        <span class="price">¥{{ orderDetail.amount.toFixed(2) }}</span>
      </div>
    </el-card>

    <el-card class="detail-card">
      <template #header>
        <div class="card-header">
          <span>订单操作</span>
        </div>
      </template>

      <div class="operation-buttons">
        <el-button 
          type="primary"
          :disabled="orderDetail.status !== 'pending'"
          @click="handleConfirmPayment"
        >
          确认付款
        </el-button>
        <el-button 
          type="success"
          :disabled="orderDetail.status !== 'paid'"
          @click="handleShip"
        >
          发货
        </el-button>
        <el-button 
          :disabled="orderDetail.status !== 'shipped'"
          @click="handleComplete"
        >
          完成订单
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()

// 模拟订单详情数据
const orderDetail = ref({
  id: route.params.id,
  orderNo: 'ORD202503160001',
  status: 'pending',
  customerName: '张三',
  phone: '13800138000',
  address: '北京市朝阳区xxx街道xxx号',
  createTime: '2025-03-16 10:00:00',
  amount: 599.98,
  items: [
    {
      productName: '商品1',
      price: 299.99,
      quantity: 1
    },
    {
      productName: '商品2',
      price: 299.99,
      quantity: 1
    }
  ]
})

const getStatusType = (status) => {
  const map = {
    pending: 'warning',
    paid: 'success',
    shipped: 'primary',
    completed: 'info'
  }
  return map[status]
}

const getStatusText = (status) => {
  const map = {
    pending: '待付款',
    paid: '已付款',
    shipped: '已发货',
    completed: '已完成'
  }
  return map[status]
}

const goBack = () => {
  router.back()
}

const handleConfirmPayment = () => {
  ElMessage.success('确认付款成功')
  orderDetail.value.status = 'paid'
}

const handleShip = () => {
  ElMessage.success('发货成功')
  orderDetail.value.status = 'shipped'
}

const handleComplete = () => {
  ElMessage.success('订单已完成')
  orderDetail.value.status = 'completed'
}
</script>

<style scoped>
.order-detail {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.detail-card {
  margin-bottom: 20px;
}

.card-header {
  font-weight: bold;
}

.order-total {
  margin-top: 20px;
  text-align: right;
  font-size: 16px;
}

.price {
  color: #f56c6c;
  font-size: 20px;
  font-weight: bold;
  margin-left: 8px;
}

.operation-buttons {
  display: flex;
  gap: 10px;
}
</style>