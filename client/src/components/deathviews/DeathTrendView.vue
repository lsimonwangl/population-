<script setup>
import AreaSelector from '../common/AreaSelector.vue'
import { ref, inject, computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

// 註冊 Chart.js 元件
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const axios = inject('axios')
const trend = ref(null)
const error = ref('')
const selectedCity = ref('')
const selectedDistrict = ref('')
const selectedVillage = ref('')

const site_id = computed(() => selectedCity.value + selectedDistrict.value)
const village = computed(() => selectedVillage.value)

const fetchDeathTrend = async () => {
  error.value = ''
  trend.value = null
  try {
    const response = await axios.get(`/death/trend/${site_id.value}/${village.value}`)
    trend.value = response.data
  } catch (err) {
    if (err.response) {
      error.value = `查詢失敗: ${err.response.status}`
    } else if (err.request) {
      error.value = '無法連接到伺服器'
    } else {
      error.value = err.message
    }
  }
}

// 準備圖表資料
const chartData = computed(() => {
  if (!trend.value) return { labels: [], datasets: [] }

  return {
    labels: trend.value.map(item => item.month.toString()),
    datasets: [
      {
        label: '死亡人數',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        data: trend.value.map(item => item.total)
      }
    ]
  }
})

// 圖表選項
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false
}
</script>

<template>
  <div class="cuda-page">
    <h1>某地區死亡趨勢 頁面</h1>
    <AreaSelector
      v-model:selectedCity="selectedCity"
      v-model:selectedDistrict="selectedDistrict"
      v-model:selectedVillage="selectedVillage"
    />
    <button @click="fetchDeathTrend">查詢</button>

    <!-- 錯誤訊息 -->
    <div v-if="error" class="error">{{ error }}</div>

    <!-- 趨勢圖表 -->
    <div class="chart-container" v-if="trend && trend.length">
      <Line :data="chartData" :options="chartOptions" :height="300" :width="600" />
    </div>

    <!-- 表格呈現 -->
    <table v-if="trend && trend.length" class="trend-table">
      <thead>
        <tr>
          <th>年月</th>
          <th>死亡總數</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in trend" :key="item.month">
          <td>{{ item.month }}</td>
          <td>{{ item.total }}</td>
        </tr>
      </tbody>
    </table>

  </div>
</template>

<style scoped>
.back-link {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  margin: 0.5rem;
  background-color: #42b883;
  color: white;
  text-decoration: none;
}

.cuda-page {
  padding: 2rem;
  text-align: center;
}

.chart-container {
  height: 400px;
  margin-top: 2rem;
}

.trend-table {
  margin: 2rem auto;
  border-collapse: collapse;
  width: 60%;
  font-size: 1rem;
}

.trend-table th,
.trend-table td {
  border: 1px solid #ccc;
  padding: 0.75rem 1.2rem;
  text-align: center;
}

.trend-table th {
  background-color: #f44336;
  color: white;
}
</style>
