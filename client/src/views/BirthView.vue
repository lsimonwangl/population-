<script setup>

</script>

<template>
  <div class="birth-page">
    <h1>出生統計 頁面</h1>
    <p>這是 出生統計 的頁面</p>
    <router-link :to="{ name: 'birthTotal' }" class="nav-item">月份出生總數</router-link>
    <router-link :to="{ name: 'birthTrend' }" class="nav-item">出生趨勢</router-link>
    <br>
    <router-link to="/" class="back-link">返回首頁</router-link>

    
  </div>
</template>

<style scoped>
.nav-item {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  margin: 0.5rem;
  background-color: #42b883;
  color: white;
  text-decoration: none;
}

.back-link {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  margin: 5rem;
  background-color: #42b883;
  color: white;
  text-decoration: none;
}

.birth-page {
  padding: 2rem;
  text-align: center;
}
</style>