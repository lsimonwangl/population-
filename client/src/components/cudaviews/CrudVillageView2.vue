<script setup>
import AreaSelector from '../common/AreaSelector.vue'
import { ref, inject, computed } from 'vue'
const axios = inject('axios')
const villageData = ref(null)
const error = ref('')
const selectedCity = ref('')
const selectedDistrict = ref('')
const selectedVillage = ref('')

const site_id = computed(() => selectedCity.value + selectedDistrict.value)
const village = computed(() => selectedVillage.value)

const fetchDeathTrend = async () => {
  // 清空之前的錯誤訊息和查詢結果
  error.value = ''
  villageData.value = null
  console.log('查詢 site_id:', site_id.value)
  console.log('查詢 village:', village.value)
  try {
    // 向後端 API 發送 GET 請求
    const response = await axios.get(`/records/village/${site_id.value}/${village.value}`)
    villageData.value = response.data
  } catch (err) {
    // 捕獲並顯示錯誤訊息
    if (err.response) {
      // 服務器回應了錯誤狀態碼
      error.value = `查詢失敗: ${err.response.status}`
    } else if (err.request) {
      // 請求已發送但沒有收到回應
      error.value = '無法連接到伺服器'
    } else {
      // 其他錯誤
      error.value = err.message
    }
  }
}
</script>

<template>
  <div class="cuda-page">
    <h1>查詢特定村里資料 頁面</h1>
    
    <AreaSelector
      v-model:selectedCity="selectedCity"
      v-model:selectedDistrict="selectedDistrict"
      v-model:selectedVillage="selectedVillage"
    />
    
    <p>你選擇的地區是：{{ selectedCity }}{{ selectedDistrict }} {{ selectedVillage }}</p>
    <button @click="fetchDeathTrend">查詢</button>
    <p>site_id：{{ site_id }}</p>

    <!-- ✅ 表格顯示村里資料 -->
    <table v-if="villageData.length > 0" border="1" style="margin: 20px auto;">
      <thead>
        <tr>
          <th>年月</th>
          <th>出生總數</th>
          <th>死亡總數</th>
          <th>結婚總數</th>
          <th>離婚總數</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in villageData" :key="index">
          <td>{{ item.statistic_yyyymm }}</td>
          <td>{{ item.birth_total }}</td>
          <td>{{ item.death_total }}</td>
          <td>{{ item.marry_total }}</td>
          <td>{{ item.divorce_total }}</td>
        </tr>
      </tbody>
    </table>

    <div v-if="error" class="error">{{ error }}</div>
    <router-link to="/" class="back-link">返回首頁</router-link>
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
</style>