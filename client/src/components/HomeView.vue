
<script setup>
// 首頁組件
</script>

<template>
  <div class="home">
    <h1>首頁</h1>
    <nav>
      <router-link to="/cuda" class="nav-link">CUDA 頁面</router-link>
    </nav>
  </div>
</template>

<style scoped>
.home {
  padding: 2rem;
  text-align: center;
}

.nav-link {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  margin: 0.5rem;
  background-color: #42b883;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-link:hover {
  background-color: #369870;
}
</style>
