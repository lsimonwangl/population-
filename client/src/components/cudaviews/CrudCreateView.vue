<template>
  <div class="crud-create-page">
    <h2>新增一筆人口紀錄</h2>

    <form @submit.prevent="submit">
      <div class="form-group" v-for="field in fields" :key="field.key">
        <label :for="field.key">{{ field.label }}</label>
        <input v-model="form[field.key]" :type="field.type" :id="field.key" />
      </div>

      <button type="submit">送出</button>
    </form>

    <div v-if="message" class="success">{{ message }}</div>
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'

const axios = inject('axios')

const form = ref({
  statistic_yyyymm: '',
  district_code: '',
  site_id: '',
  village: '',
  birth_total: 0,
  birth_total_m: 0,
  birth_total_f: 0,
  death_total: 0,
  death_m: 0,
  death_f: 0,
  marry_pair: 0,
  divorce_pair: 0
})

const fields = [
  { key: 'statistic_yyyymm', label: '統計年月（如10810）', type: 'number' },
  { key: 'district_code', label: '區域代碼', type: 'text' },
  { key: 'site_id', label: '地區代碼 site_id', type: 'text' },
  { key: 'village', label: '村里名稱', type: 'text' },
  { key: 'birth_total', label: '出生總數', type: 'number' },
  { key: 'birth_total_m', label: '男嬰數', type: 'number' },
  { key: 'birth_total_f', label: '女嬰數', type: 'number' },
  { key: 'death_total', label: '死亡總數', type: 'number' },
  { key: 'death_m', label: '死亡男數', type: 'number' },
  { key: 'death_f', label: '死亡女數', type: 'number' },
  { key: 'marry_pair', label: '結婚對數', type: 'number' },
  { key: 'divorce_pair', label: '離婚對數', type: 'number' }
]

const message = ref('')
const error = ref('')

const submit = async () => {
  message.value = ''
  error.value = ''
  try {
    const res = await axios.post('/records', form.value)
    message.value = '✅ 新增成功！'
    // 重設表單
    form.value = Object.fromEntries(
      Object.entries(form.value).map(([k, v]) => [k, typeof v === 'number' ? 0 : ''])
    )
  } catch (err) {
    error.value = err.response?.data?.message || err.message || '新增失敗'
  }
}
</script>

<style scoped>
.crud-create-page {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1rem;
  background-color: #f8f8f8;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.3rem;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 0.7rem 1.5rem;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.success {
  margin-top: 1rem;
  color: green;
}

.error {
  margin-top: 1rem;
  color: red;
}
</style>
