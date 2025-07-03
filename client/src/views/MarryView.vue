<script setup>

</script>

<template>
  <div class="cuda-page">
    <h1>婚姻統計 頁面</h1>
    <p>這是 婚姻統計 的頁面</p>
    <router-link :to="{ name: 'marryTotal' }" class="nav-item">月份婚姻總數</router-link>
    <router-link :to="{ name: 'marryTrend' }" class="nav-item">婚姻趨勢</router-link>
    <br>
    <router-link to="/" class="back-link">返回首頁</router-link>
  </div>
</template>

<style scoped>
.back-link {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  margin: 5rem;
  background-color: #42b883;
  color: white;
  text-decoration: none;
}

.cuda-page {
  padding: 2rem;
  text-align: center;
}

.nav-item {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  margin: 0.5rem;
  background-color: #42b883;
  color: white;
  text-decoration: none;
}
</style>