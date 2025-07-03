
<template>
  <div class="crud-list-page">
    <h1>查詢全部資料</h1>
    
    <!-- 資料載入中提示 -->
    <div v-if="loading" class="loading">
      <p>資料載入中...</p>
    </div>
    
    <!-- 錯誤訊息 -->
    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
    </div>
    
    <!-- 資料表格 -->
    <div v-if="records.length > 0" class="records-table">
      <table>
        <thead>
          <tr>
            <th>地區代碼</th>
            <th>地區名稱</th>
            <th>年月</th>
            <th>出生數</th>
            <th>死亡數</th>
            <th>結婚對數</th>
            <th>離婚對數</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in records" :key="record.id">
            <td>{{ record.site_id }}</td>
            <td>{{ record.village }}</td>
            <td>{{ record.statistic_yyyymm }}</td>
            <td>{{ record.birth_total }}</td>
            <td>{{ record.death_total }}</td>
            <td>{{ record.marry_pair }}</td>
            <td>{{ record.divorce_pair }}</td>
            <td class="actions">
              <button @click="editRecord(record.id)" class="edit-btn">編輯</button>
              <button @click="confirmDelete(record.id)" class="delete-btn">刪除</button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- 分頁控制 -->
      <div class="pagination">
        <button 
          @click="prevPage" 
          :disabled="page <= 1"
          class="page-btn"
        >
          上一頁
        </button>
        <span class="page-info">第 {{ page }} 頁</span>
        <button 
          @click="nextPage" 
          :disabled="records.length < pageSize"
          class="page-btn"
        >
          下一頁
        </button>
      </div>
    </div>
    
    <!-- 無資料提示 -->
    <div v-else-if="!loading && !error" class="no-records">
      <p>目前沒有資料</p>
    </div>
    
    <div class="actions-bar">
      <router-link to="/cuda" class="back-link">返回 CUDA 頁面</router-link>
    </div>
  </div>
</template>

<script setup>
// 引入 Vue 3 的響應式 API
import { ref, watchEffect, inject } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const axios = inject('axios')
const pageSize = 10 // 每頁顯示的記錄數量

/**
 * 響應式資料定義
 */
// 當前頁數（從 1 開始）
const page = ref(1)
// 當前頁的記錄陣列
const records = ref([])
// 錯誤訊息字串
const error = ref('')
// 載入狀態
const loading = ref(false)

/**
 * 從後端 API 獲取指定頁數的記錄
 * 使用查詢參數 page 進行分頁
 */
const fetchRecords = async () => {
  // 清空之前的錯誤訊息
  error.value = ''
  loading.value = true

  try {
    // 向後端 API 發送 GET 請求，帶上頁數參數
    const res = await axios.get(`/records?page=${page.value}`)

    // 檢查 HTTP 響應
    records.value = res.data
  } catch (err) {
    // 捕獲並顯示錯誤訊息
    if (err.response) {
      error.value = `查詢失敗: ${err.response.status}`
    } else if (err.request) {
      error.value = '無法連接到伺服器'
    } else {
      error.value = err.message
    }
  } finally {
    loading.value = false
  }
}

/**
 * 下一頁功能
 * 增加頁數並重新獲取資料
 */
const nextPage = () => {
  page.value++
}

/**
 * 上一頁功能
 * 減少頁數並重新獲取資料（確保不會小於第 1 頁）
 */
const prevPage = () => {
  if (page.value > 1) {
    page.value--
  }
}

/**
 * 查看記錄詳情
 */
const viewRecord = (id) => {
  router.push(`/cuda/view/${id}`)
}

/**
 * 編輯記錄
 */
const editRecord = (id) => {
  router.push(`/cuda/edit/${id}`)
}

/**
 * 確認刪除記錄
 */
const confirmDelete = (id) => {
  if (confirm('確定要刪除這筆資料嗎？')) {
    deleteRecord(id)
  }
}

/**
 * 刪除記錄
 */
const deleteRecord = async (id) => {
  try {
    const res = await axios.delete(`/records/${id}`)
    
    // 刪除成功後重新獲取當前頁的資料
    fetchRecords()
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

// 使用 watchEffect 監聽 page 變化並自動獲取資料
// 這會在組件初始化和 page 變化時都執行 fetchRecords
watchEffect(() => {
  fetchRecords()
})
</script>

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
