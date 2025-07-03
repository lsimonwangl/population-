
<script setup>
// CUDA 頁面組件
</script>

<template>
  <div class="cuda-page">
    <h1>CUDA 頁面</h1>
    <p>這是 CUDA 的頁面</p>
    <router-link :to="{ name: 'crudVillage' }" class="nav-item">村里基本資料 CRUD</router-link>
    <router-link :to="{ name: 'crudCreate' }" class="nav-item">新增資料</router-link>
    <router-link :to="{ name: 'crudMonth' }" class="nav-item">村里特定月份資料查詢</router-link>
    <router-link :to="{ name: 'crudList' }" class="nav-item">村里全部資料查詢</router-link>
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