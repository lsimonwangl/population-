<!--
  出生總數查詢頁面組件
  功能：根據輸入的年月（YYYYMM格式）查詢該月份的出生總數
  API 端點：GET /api/birth/total/:yyyymm
-->
<template>
  <div class="birth-total-page">
    <!-- 頁面標題 -->
    <h2>查詢某月份的出生總數</h2>

    <!-- 輸入欄位：年月格式 YYYYMM -->
    <MonthSelector v-model: ="selectedMonth" />

    <!-- 查詢按鈕 -->
    <button @click="fetchBirthTotal">查詢</button>

    <!-- 查詢結果顯示區域：只有當 total 不為 null 時才顯示 -->
    <div v-if="total !== null">
      <p>該月份出生總數為：<strong>{{ total }}</strong> 人</p>
    </div>

    <!-- 錯誤訊息顯示區域：只有當有錯誤時才顯示 -->
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script setup>
// 引入 Vue 3 的響應式 API
import { ref, inject } from 'vue'
import MonthSelector from '../common/MonthSelector.vue'
const axios = inject('axios')
const selectedMonth = ref('')
/**
 * 響應式資料定義
 */
// 使用者輸入的年月字串（格式：YYYYMM，例如：10810）
const yyyymm = ref('')
// 查詢結果：出生總數（null 表示尚未查詢或查詢失敗）
const total = ref(null)
// 錯誤訊息字串
const error = ref('')

/**
 * 查詢出生總數的異步函數
 * 向後端 API 發送請求，獲取指定月份的出生總數
 */
const fetchBirthTotal = async () => {
  // 清空之前的錯誤訊息和查詢結果
  error.value = ''
  total.value = null

  try {
    // 向後端 API 發送 GET 請求
    const response = await axios.get(`/birth/total/${selectedMonth.value}`)
    total.value = response.data.total
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

<style scoped>
.birth-total-page {
  padding: 20px;
}
input {
  margin-right: 10px;
  padding: 6px;
}
button {
  padding: 6px 12px;
}
.error {
  color: red;
  margin-top: 10px;
}
</style>

<style scoped>
.back-link {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  margin: 0.5rem;
  background-color: #42b883;
  color: white;
  text-decoration: none;
}

.birth-total-page {
  padding: 2rem;
  text-align: center;
}
</style>