<script setup>

</script>

<template>
  <div class="cuda-page">
    <h1>離婚統計 頁面</h1>
    <p>這是 離婚統計 的頁面</p>
    <router-link :to="{ name: 'divorceTotal' }" class="nav-item">月份離婚總數</router-link>
    <router-link :to="{ name: 'divorceTrend' }" class="nav-item">離婚趨勢</router-link>
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