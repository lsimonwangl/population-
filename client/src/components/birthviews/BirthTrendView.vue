
<script setup>
import AreaSelector2 from '../common/AreaSelector2.vue'
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
const site_id = computed(() => selectedCity.value + selectedDistrict.value)
const fetchBirthTrend = async () => {
  error.value = ''
  trend.value = null

  try {
    const res = await axios.get(`/birth/trend/${site_id.value}`)
    trend.value = res.data
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

// 準備圖表數據
const chartData = computed(() => {
  if (!trend.value) return { datasets: [], labels: [] }
  
  return {
    labels: trend.value.map(item => item.month.toString()),
    datasets: [
      {
        label: '出生人數',
        backgroundColor: 'rgba(66, 184, 131, 0.2)',
        borderColor: 'rgba(66, 184, 131, 1)',
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
  <div class="birth-trend-page">
    <h2>查詢地區的出生趨勢</h2>
    <AreaSelector2
      v-model:selectedCity="selectedCity"
      v-model:selectedDistrict="selectedDistrict"
    />
    <button @click="fetchBirthTrend">查詢</button>
    <div v-if="error" class="error">{{ error }}</div>
  </div>
  <div class="chart-container">
        <Line
          :data="chartData"
          :options="chartOptions"
          :height="300"
          :width="600"
        />
  </div>
  <table v-if="trend && trend.length > 0" class="trend-table">
  <thead>
    <tr>
      <th>月份</th>
      <th>出生人數</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(item, index) in trend" :key="index">
      <td>{{ item.month }}</td>
      <td>{{ item.total }}</td>
    </tr>
  </tbody>
  </table>
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

.birth-trend-page {
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
  background-color: #42b883;
  color: white;
}
</style>