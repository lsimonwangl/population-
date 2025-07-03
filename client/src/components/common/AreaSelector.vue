<template>
  <div class="area-selector">
    <h2>選擇地區</h2>

    <label>城市：</label>
    <select v-model="selectedCity">
      <option disabled value="">請選擇城市</option>
      <option v-for="city in cityList" :key="city">{{ city }}</option>
    </select>

    <label>區域：</label>
    <select v-model="selectedDistrict" :disabled="!selectedCity">
      <option disabled value="">請選擇區域</option>
      <option
        v-for="district in districtList"
        :key="district"
      >{{ district }}</option>
    </select>

    <label>村里：</label>
    <select v-model="selectedVillage" :disabled="!selectedDistrict">
      <option disabled value="">請選擇村里</option>
      <option
        v-for="village in villageList"
        :key="village"
      >{{ village }}</option>
    </select>

    <p v-if="selectedVillage">
      你選擇的是：{{ selectedCity+selectedDistrict }} {{ selectedVillage }}
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import areaData from '@/assets/output.json'

// const selectedCity = ref('')
// const selectedDistrict = ref('')
// const selectedVillage = ref('')
const selectedCity = defineModel('selectedCity')
const selectedDistrict = defineModel('selectedDistrict')
const selectedVillage = defineModel('selectedVillage')

const cityList = computed(() => {
  return [...new Set(areaData.map(item => item.city))]
})

const districtList = computed(() => {
  const districts = areaData
    .filter(item => item.city === selectedCity.value)
    .map(item => item.district);

  return [...new Set(districts)];
});

const villageList = computed(() => {
  return areaData
    .filter(item =>
      item.city === selectedCity.value &&
      item.district === selectedDistrict.value
    )
    .map(item => item.village)
})
</script>

<style scoped>
.area-selector {
  display: flex;
  flex-direction: column;
  max-width: 300px;
  margin: 0 auto;
}

.area-selector select {
  margin-bottom: 1rem;
  padding: 0.5rem;
}
</style>