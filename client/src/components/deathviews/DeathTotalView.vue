<template>
  <div class="death-total-page">
    <h2>查詢某月份的死亡總數</h2>

    <input v-model="yyyymm" placeholder="請輸入年月（如 10810）" />
    <button @click="fetchDeathTotal">查詢</button>

    <div v-if="total !== null">
      <p>該月份死亡總數為：<strong>{{ total }}</strong> 人</p>
    </div>

    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
const axios = inject('axios')

const yyyymm = ref('')
const total = ref(null)
const error = ref('')

const fetchDeathTotal = async () => {
  // 清空之前的錯誤訊息和查詢結果
  error.value = ''
  total.value = null

  try {
    // 向後端 API 發送 GET 請求
    const response = await axios.get(`/death/total/${yyyymm.value}`)
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
.death-total-page {
  padding: 20px;
  text-align: center;
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
