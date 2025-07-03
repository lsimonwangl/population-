<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  modelValue: { type: Object, default: () => ({ city: '', district: '', village: '' }) }
})

const emit = defineEmits(['update:modelValue', 'change'])

// 響應式資料
const locations = ref([])
const selected = ref({
  city: props.modelValue.city || '',
  district: props.modelValue.district || '',
  village: props.modelValue.village || ''
})
const loading = ref(false)

// 計算屬性
const cities = computed(() => [...new Set(locations.value.map(loc => loc.city))].sort())
const districts = computed(() => {
  if (!selected.value.city) return []
  return [...new Set(
    locations.value
      .filter(loc => loc.city === selected.value.city)
      .map(loc => loc.district)
  )].sort()
})
const villages = computed(() => {
  if (!selected.value.city || !selected.value.district) return []
  return locations.value
    .filter(loc => 
      loc.city === selected.value.city && 
      loc.district === selected.value.district
    )
    .map(loc => loc.village)
    .sort()
})

// 處理選擇變更
const updateSelection = () => {
  emit('update:modelValue', { ...selected.value })
  emit('change', { ...selected.value })
}

const handleCityChange = () => {
  selected.value.district = ''
  selected.value.village = ''
  updateSelection()
}

const handleDistrictChange = () => {
  selected.value.village = ''
  updateSelection()
}

// 載入資料
const loadData = async () => {
  loading.value = true
  try {
    const res = await fetch('/output.json')
    locations.value = await res.json()
  } catch (err) {
    console.error('載入失敗:', err)
  } finally {
    loading.value = false
  }
}

onMounted(loadData)
</script>

<template>
  <div class="location-selector">
    <div v-if="loading">載入中...</div>
    
    <div v-else class="selectors">
      <!-- 城市選擇 -->
      <select v-model="selected.city" @change="handleCityChange">
        <option value="">選擇城市</option>
        <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
      </select>
      
      <!-- 區域選擇 -->
      <select 
        v-model="selected.district" 
        @change="handleDistrictChange"
        :disabled="!selected.city"
      >
        <option value="">選擇區域</option>
        <option v-for="district in districts" :key="district" :value="district">
          {{ district }}
        </option>
      </select>
      
      <!-- 村里選擇 -->
      <select 
        v-model="selected.village"
        @change="updateSelection"
        :disabled="!selected.district"
      >
        <option value="">選擇村里</option>
        <option v-for="village in villages" :key="village" :value="village">
          {{ village }}
        </option>
      </select>
    </div>
  </div>
</template>

<style scoped>
.location-selector {
  margin-bottom: 1rem;
}
.selectors {
  display: flex;
  gap: 0.5rem;
}
select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}
select:disabled {
  background-color: #f5f5f5;
}
</style>
