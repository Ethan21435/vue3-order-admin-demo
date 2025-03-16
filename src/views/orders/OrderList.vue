&lt;template&gt;
  &lt;div class="order-list"&gt;
    &lt;el-card class="search-card"&gt;
      &lt;el-form :model="searchForm" :inline="true"&gt;
        &lt;el-form-item label="订单号"&gt;
          &lt;el-input v-model="searchForm.orderNo" placeholder="请输入订单号" clearable /&gt;
        &lt;/el-form-item&gt;
        &lt;el-form-item label="订单状态"&gt;
          &lt;el-select v-model="searchForm.status" placeholder="请选择状态" clearable&gt;
            &lt;el-option label="待付款" value="pending" /&gt;
            &lt;el-option label="已付款" value="paid" /&gt;
            &lt;el-option label="已发货" value="shipped" /&gt;
            &lt;el-option label="已完成" value="completed" /&gt;
          &lt;/el-select&gt;
        &lt;/el-form-item&gt;
        &lt;el-form-item label="下单时间"&gt;
          &lt;el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          /&gt;
        &lt;/el-form-item&gt;
        &lt;el-form-item&gt;
          &lt;el-button type="primary" @click="handleSearch"&gt;搜索&lt;/el-button&gt;
          &lt;el-button @click="resetSearch"&gt;重置&lt;/el-button&gt;
        &lt;/el-form-item&gt;
      &lt;/el-form&gt;
    &lt;/el-card&gt;

    &lt;el-card class="table-card"&gt;
      &lt;template #header&gt;
        &lt;div class="card-header"&gt;
          &lt;span&gt;订单列表&lt;/span&gt;
          &lt;div class="header-operations"&gt;
            &lt;el-button type="primary" @click="handleExport"&gt;导出订单&lt;/el-button&gt;
            &lt;el-button type="danger" :disabled="!selectedOrders.length" @click="handleBatchDelete"&gt;
              批量删除
            &lt;/el-button&gt;
          &lt;/div&gt;
        &lt;/div&gt;
      &lt;/template&gt;

      &lt;el-table
        v-loading="loading"
        :data="orderList"
        @selection-change="handleSelectionChange"
      &gt;
        &lt;el-table-column type="selection" width="55" /&gt;
        &lt;el-table-column prop="orderNo" label="订单号" width="180" /&gt;
        &lt;el-table-column prop="customerName" label="客户名称" width="120" /&gt;
        &lt;el-table-column prop="phone" label="联系电话" width="120" /&gt;
        &lt;el-table-column prop="amount" label="订单金额" width="120"&gt;
          &lt;template #default="{ row }"&gt;
            ¥{{ row.amount.toFixed(2) }}
          &lt;/template&gt;
        &lt;/el-table-column&gt;
        &lt;el-table-column prop="status" label="状态" width="100"&gt;
          &lt;template #default="{ row }"&gt;
            &lt;el-tag :type="getStatusType(row.status)"&gt;
              {{ getStatusText(row.status) }}
            &lt;/el-tag&gt;
          &lt;/template&gt;
        &lt;/el-table-column&gt;
        &lt;el-table-column prop="createTime" label="创建时间" width="180"&gt;
          &lt;template #default="{ row }"&gt;
            {{ formatDateTime(row.createTime) }}
          &lt;/template&gt;
        &lt;/el-table-column&gt;
        &lt;el-table-column label="操作" fixed="right" width="150"&gt;
          &lt;template #default="{ row }"&gt;
            &lt;el-button link type="primary" @click="viewDetail(row.id)"&gt;查看&lt;/el-button&gt;
            &lt;el-button link type="danger" @click="handleDelete(row)"&gt;删除&lt;/el-button&gt;
          &lt;/template&gt;
        &lt;/el-table-column&gt;
      &lt;/el-table&gt;

      &lt;div class="pagination"&gt;
        &lt;el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        /&gt;
      &lt;/div&gt;
    &lt;/el-card&gt;
  &lt;/div&gt;
&lt;/template&gt;

&lt;script setup&gt;
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getOrders } from '@/api/order'
import { exportToExcel, formatDateTime } from '@/utils/export'

const router = useRouter()
const loading = ref(false)
const orderList = ref([])
const selectedOrders = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

const searchForm = reactive({
  orderNo: '',
  status: '',
  dateRange: []
})

const getStatusType = (status) => {
  const types = {
    pending: 'warning',
    paid: 'success',
    shipped: 'primary',
    completed: 'info'
  }
  return types[status] || 'info'
}

const getStatusText = (status) => {
  const texts = {
    pending: '待付款',
    paid: '已付款',
    shipped: '已发货',
    completed: '已完成'
  }
  return texts[status] || status
}

const loadOrders = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      orderNo: searchForm.orderNo,
      status: searchForm.status,
      startDate: searchForm.dateRange?.[0],
      endDate: searchForm.dateRange?.[1]
    }
    
    const { data } = await getOrders(params)
    orderList.value = data.list
    total.value = data.total
  } catch (error) {
    ElMessage.error('加载订单列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  loadOrders()
}

const resetSearch = () => {
  Object.assign(searchForm, {
    orderNo: '',
    status: '',
    dateRange: []
  })
  handleSearch()
}

const handleSizeChange = (val) => {
  pageSize.value = val
  loadOrders()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  loadOrders()
}

const viewDetail = (id) => {
  router.push(`/orders/${id}`)
}

const handleSelectionChange = (val) => {
  selectedOrders.value = val
}

const handleExport = () => {
  const exportData = orderList.value.map(order => ({
    '订单号': order.orderNo,
    '客户名称': order.customerName,
    '联系电话': order.phone,
    '订单金额': order.amount,
    '订单状态': getStatusText(order.status),
    '创建时间': formatDateTime(order.createTime)
  }))
  
  exportToExcel(exportData, `订单列表_${formatDateTime(new Date())}.xlsx`)
}

const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除订单 ${row.orderNo} 吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.success('删除成功')
    loadOrders()
  })
}

const handleBatchDelete = () => {
  if (!selectedOrders.value.length) return
  
  ElMessageBox.confirm(
    `确定要删除选中的 ${selectedOrders.value.length} 个订单吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.success('批量删除成功')
    loadOrders()
  })
}

onMounted(() => {
  loadOrders()
})
&lt;/script&gt;

&lt;style scoped&gt;
.order-list {
  padding: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-operations {
  display: flex;
  gap: 10px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
&lt;/style&gt;