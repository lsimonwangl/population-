<template>
  <div class="month-selector">
    <label for="month">月份：</label>
    <select id="month" v-model="internalMonth">
      <option disabled value="">請選擇月份</option>
      <option v-for="m in 12" :key="m" :value="m">108年 {{ m }} 月</option>
    </select>

    <p v-if="internalMonth">
      你選擇的是：108 年 {{ internalMonth }} 月（{{ formatted }}）
    </p>
  </div>
</template>

<script setup>
import { computed, watch, ref } from 'vue'

const model = defineModel() 
const internalMonth = ref('')


watch(internalMonth, (newMonth) => {
  const padded = newMonth.toString().padStart(2, '0')
  model.value = `108${padded}`
})


const formatted = computed(() => model.value)
</script>

<style scoped>
.month-selector {
  display: flex;
  flex-direction: column;
  max-width: 200px;
  margin: 0 auto;
}

select {
  margin-top: 0.5rem;
  padding: 0.5rem;
}
</style>
