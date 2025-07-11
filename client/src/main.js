// import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://43.213.16.88:3000/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})
const app = createApp(App)

app.provide('axios', axiosInstance)

app.use(router).mount('#app')
