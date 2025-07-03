
<script setup>
// CUDA 頁面組件
</script>

<template>
  <div class="cuda-page">
    <h1>CUDA 頁面</h1>
    <p>這是 CUDA 的頁面</p>
    <router-link to="/" class="back-link">返回首頁</router-link>
  </div>
</template>

<style scoped>
.cuda-page {
  padding: 2rem;
  text-align: center;
}

.back-link {
  display: inline-block;
  padding: 0.5rem 1rem;
  margin-top: 1rem;
  background-color: #6c757d;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.back-link:hover {
  background-color: #5a6268;
}
</style>