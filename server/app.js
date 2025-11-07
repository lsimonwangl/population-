
// ===== 後端伺服器主要應用程式檔案 =====
// 這個檔案是整個後端 API 伺服器的核心，負責設定和啟動伺服器

// ===== 載入環境變數 =====
// 從 .env 檔案中載入環境變數（如資料庫連接字串、端口號等）
require('dotenv').config();

// ===== 引入必要的套件 =====
const express = require('express');        // Express.js 網頁框架
const cors = require('cors');              // 跨域資源共享中間件
const bodyParser = require('body-parser'); // 請求內容解析中間件

// ===== 引入資料庫配置 =====
const { initDatabase } = require('./config/database');

// ===== 引入路由模組 =====
// 每個路由檔案負責處理特定功能的 API 端點
const recordRoutes = require('./routes/recordRoutes');   // 基本 CRUD 操作
const birthRoutes = require('./routes/birthRoutes');     // 出生統計功能
const deathRoutes = require('./routes/deathRoutes');     // 死亡統計功能
const marryRoutes = require('./routes/marryRoutes');     // 婚姻統計功能
const divorceRoutes = require('./routes/divorceRoutes'); // 離婚統計功能

// ===== 創建 Express 應用程式實例 =====
const app = express();

// ===== 設定中間件 =====
// 啟用 CORS，允許前端跨域請求後端 API
app.use(cors());

// 設定 JSON 解析器，讓伺服器能夠解析 JSON 格式的請求內容
app.use(bodyParser.json());

// ===== 初始化並連接 MySQL 資料庫 =====
initDatabase()
  .then(() => console.log("MySQL database connected and initialized"))
  .catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1); // 如果資料庫連接失敗，終止程序
  });

// ===== 設定 API 路由 =====
// 將不同的路由模組掛載到對應的路徑上
app.use('/api/records', recordRoutes);   // 基本 CRUD：/api/records/*
app.use('/api/birth', birthRoutes);      // 出生統計：/api/birth/*
app.use('/api/death', deathRoutes);      // 死亡統計：/api/death/*
app.use('/api/marry', marryRoutes);      // 婚姻統計：/api/marry/*
app.use('/api/divorce', divorceRoutes);  // 離婚統計：/api/divorce/*

// ===== 啟動伺服器 =====
// 設定伺服器端口（從環境變數或預設 3000）
const PORT = process.env.PORT || 3000;

// 啟動伺服器並監聽指定端口
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
