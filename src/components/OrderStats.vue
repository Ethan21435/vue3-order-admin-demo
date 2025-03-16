&lt;template&gt;
  &lt;div class="order-stats"&gt;
    &lt;el-row :gutter="20"&gt;
      &lt;el-col :span="6" v-for="(stat, index) in stats" :key="index"&gt;
        &lt;el-card class="stat-card" :body-style="{ padding: '20px' }"&gt;
          &lt;div class="stat-content"&gt;
            &lt;div class="stat-value"&gt;{{ stat.value }}&lt;/div&gt;
            &lt;div class="stat-label"&gt;{{ stat.label }}&lt;/div&gt;
          &lt;/div&gt;
        &lt;/el-card&gt;
      &lt;/el-col&gt;
    &lt;/el-row&gt;

    &lt;el-row :gutter="20" class="charts-row"&gt;
      &lt;el-col :span="12"&gt;
        &lt;el-card&gt;
          &lt;template #header&gt;
            &lt;div class="card-header"&gt;订单状态分布&lt;/div&gt;
          &lt;/template&gt;
          &lt;div ref="pieChartRef" class="chart-container"&gt;&lt;/div&gt;
        &lt;/el-card&gt;
      &lt;/el-col&gt;
      &lt;el-col :span="12"&gt;
        &lt;el-card&gt;
          &lt;template #header&gt;
            &lt;div class="card-header"&gt;近期订单趋势&lt;/div&gt;
          &lt;/template&gt;
          &lt;div ref="lineChartRef" class="chart-container"&gt;&lt;/div&gt;
        &lt;/el-card&gt;
      &lt;/el-col&gt;
    &lt;/el-row&gt;
  &lt;/div&gt;
&lt;/template&gt;

&lt;script setup&gt;
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { getOrderStats } from '@/api/order'

const stats = ref([
  { label: '总订单数', value: 0 },
  { label: '总金额', value: '¥0' },
  { label: '待处理订单', value: 0 },
  { label: '今日订单', value: 0 }
])

const pieChartRef = ref(null)
const lineChartRef = ref(null)
let pieChart = null
let lineChart = null

const initCharts = () => {
  if (pieChartRef.value) {
    pieChart = echarts.init(pieChartRef.value)
  }
  if (lineChartRef.value) {
    lineChart = echarts.init(lineChartRef.value)
  }
}

const updateCharts = (data) => {
  // 更新饼图
  const pieOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '20',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: data.statusDistribution.pending, name: '待付款' },
          { value: data.statusDistribution.paid, name: '已付款' },
          { value: data.statusDistribution.shipped, name: '已发货' },
          { value: data.statusDistribution.completed, name: '已完成' }
        ]
      }
    ]
  }
  pieChart?.setOption(pieOption)

  // 更新折线图
  const lineOption = {
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: data.recentOrders.dates
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '订单数',
        type: 'line',
        smooth: true,
        data: data.recentOrders.counts,
        areaStyle: {
          opacity: 0.3
        }
      }
    ]
  }
  lineChart?.setOption(lineOption)
}

const loadStats = async () => {
  try {
    const { data } = await getOrderStats()
    
    // 更新统计数据
    stats.value = [
      { label: '总订单数', value: data.totalOrders },
      { label: '总金额', value: `¥${data.totalAmount.toFixed(2)}` },
      { label: '待处理订单', value: data.pendingOrders },
      { label: '今日订单', value: data.todayOrders }
    ]
    
    // 更新图表
    updateCharts(data)
  } catch (error) {
    console.error('Failed to load order stats:', error)
  }
}

const handleResize = () => {
  pieChart?.resize()
  lineChart?.resize()
}

onMounted(() => {
  initCharts()
  loadStats()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  pieChart?.dispose()
  lineChart?.dispose()
  window.removeEventListener('resize', handleResize)
})
&lt;/script&gt;

&lt;style scoped&gt;
.order-stats {
  padding: 20px;
}

.stat-card {
  height: 120px;
  margin-bottom: 20px;
}

.stat-content {
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 10px;
}

.stat-label {
  font-size: 14px;
  color: #606266;
}

.charts-row {
  margin-top: 20px;
}

.chart-container {
  height: 300px;
}

.card-header {
  font-weight: bold;
}
&lt;/style&gt;