<script setup>
// 引入 Vue 3 的響應式 API
import { ref, inject } from 'vue'
const axios = inject('axios')
/**
 * 響應式資料定義
 */
const village = ref('')
const searchResult = ref(null)
const error = ref('')

const fetchRecords = async () => {
  // 清空之前的錯誤訊息和查詢結果
  error.value = ''
  searchResult.value = null

  try {
    // 向後端 API 發送 GET 請求
    const response = await axios.get(`/records/village/${village.value}`)
    searchResult.value = response.data
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

const confirmDelete = (id) => {
  if (confirm('確定要刪除這筆資料嗎？')) {
    deleteRecord(id)
  }
}

const deleteRecord = async (id) => {
  try {
    const res = await axios.delete(`/records/${id}`)
    await fetchRecords() // 重新查詢
  } catch (err) {
    if (err.response) {
      error.value = `刪除失敗: ${err.response.status}`
    } else if (err.request) {
      error.value = '無法連接到伺服器'
    } else {
      error.value = err.message
    }
  }
}
</script>

<template>
  <div class="cuda-page">
    <h1>查詢特定村里 頁面</h1>
    <input
      v-model="village"
      placeholder="請輸入村里名稱（例如 永福里）"
      type="text"
    />
    <!-- 查詢按鈕 -->
    <button @click="fetchRecords">查詢</button>
    <br>
    
    <!-- 查詢結果 -->
    <div v-if="searchResult" class="search-result">
      <h2>{{ searchResult.village_name }} 的查詢結果</h2>
      <p>共有 {{ searchResult.total_sites }} 個地區有此村里</p>
      
      <!-- 顯示每個地區的資料 -->
      <div v-for="(site, index) in searchResult.sites" :key="site.site_id" class="site-data">
        <h3>地區 {{ index + 1 }}: {{ site.village }} (代碼: {{ site.site_id }})</h3>
        
        <table>
          <thead>
            <tr>
              <th>年月</th>
              <th>出生數</th>
              <th>死亡數</th>
              <th>結婚對數</th>
              <th>離婚對數</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in site.records" :key="record._id">
              <td>{{ record.statistic_yyyymm }}</td>
              <td>{{ record.birth_total }}</td>
              <td>{{ record.death_total }}</td>
              <td>{{ record.marry_pair }}</td>
              <td>{{ record.divorce_pair }}</td>
              <td>
                <button @click="confirmDelete(record._id)" class="delete-btn">刪除</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- 錯誤訊息 -->
    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
    </div>
    
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

.site-data {
  margin-bottom: 2rem;
  text-align: left;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

.error-message {
  color: red;
  margin: 1rem 0;
}
</style>

