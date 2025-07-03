<script setup>
import HelloWorld from './views/HelloWorld.vue'
import AreaSelector from './components/common/AreaSelector.vue'
</script>

<template>
  <div class="top-bar">
  <router-link to="/" class="logo-link">
    <header>
      <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />
      <div class="wrapper">
        <HelloWorld msg="人口管理系統" />
      </div>
      <br>
    </header>
  </router-link>
    <nav class="top-bar-nav1">
      <router-link to="/cuda" class="top-bar-nav">基本功能</router-link>
      <router-link to="/birth" class="top-bar-nav">出生統計</router-link>
      <router-link to="/death" class="top-bar-nav">死亡統計</router-link>
      <router-link to="/marry" class="top-bar-nav">婚姻統計</router-link>
      <router-link to="/divorce" class="top-bar-nav">離婚統計</router-link>
    </nav>
  </div>
  
  <main>
    <router-view />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;

}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
  display: flex;
  justify-content: center;   /* 水平置中 */
  align-items: center;       /* 垂直置中（需有高度） */
  flex-wrap: wrap;
  height: 100px;   
  padding: 20px;
  }
}
.nav-link {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  margin: 5rem;
  background-color: #42b883;
  color: white;
  text-decoration: none;
}
.top-bar {
  display: flex;
  flex-direction: column; /* 預設手機版垂直 */
  align-items: center;
  background-color: #c2ebd7;
  gap: 2rem;
}

@media (min-width: 1024px) {
  .top-bar {
    flex-direction: row;       /* 桌機橫向排列 */
    justify-content: flex-start;
    align-items: center;
    padding: 1rem 2rem;
  }

  header {
    display: flex;
    align-items: center;
    border-radius: 8px; 
    transition: background-color 0.3s, transform 0.2s;
  }
  header:hover {
  background-color: #79a793;
  transform: translateY(-2px);
}
}

.top-bar-nav {
  padding: 0.75rem 1.5rem;
  margin: 0.5rem;
  background-color: #42b883;
  color: white;
  text-decoration: none;
  font-size: 1.25rem;
  font-weight: 500;
  border-radius: 8px; 
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s, transform 0.2s;
  text-align: center;
}

.top-bar-nav:hover {
  background-color: #2f9e6e;
  transform: translateY(-2px);
}

.top-bar-nav1 {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.logo-link {
  text-decoration: none;
}

</style>
