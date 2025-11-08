
// ===== 後端伺服器主要應用程式檔案 =====
// 這個檔案是整個後端 API 伺服器的核心，負責設定和啟動伺服器

// ===== 載入環境變數 =====
// 從 .env 檔案中載入環境變數（如資料庫連接字串、端口號等）
require('dotenv').config();

// ===== 引入必要的套件 =====
const express = require('express');        // Express.js 網頁框架
const cors = require('cors');              // 跨域資源共享中間件
const bodyParser = require('body-parser'); // 請求內容解析中間件
const helmet = require('helmet');          // 安全性中間件，設定 HTTP 安全標頭

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
// 使用 Helmet 增加安全性（設定各種 HTTP 安全標頭）
app.use(helmet());
// 啟用 CORS，允許前端跨域請求後端 API
// 限制只允許指定的來源訪問，提高安全性
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:80', 'http://localhost'];

app.use(cors({
  origin: function(origin, callback) {
    // 允許沒有 origin 的請求（如 Postman 或伺服器端請求）
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 設定 JSON 解析器，讓伺服器能夠解析 JSON 格式的請求內容
app.use(bodyParser.json());

// ===== 設定 API 路由 =====
// 將不同的路由模組掛載到對應的路徑上
app.use('/api/records', recordRoutes);   // 基本 CRUD：/api/records/*
app.use('/api/birth', birthRoutes);      // 出生統計：/api/birth/*
app.use('/api/death', deathRoutes);      // 死亡統計：/api/death/*
app.use('/api/marry', marryRoutes);      // 婚姻統計：/api/marry/*
app.use('/api/divorce', divorceRoutes);  // 離婚統計：/api/divorce/*

// ===== 初始化並啟動伺服器 =====
const PORT = process.env.PORT || 3000;

// 使用 async IIFE 確保資料庫初始化完成後再啟動伺服器
(async () => {
  try {
    // 先初始化資料庫
    await initDatabase();
    console.log("MySQL database connected and initialized");

    // 資料庫準備好後才啟動伺服器
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to initialize database:', err);
    process.exit(1); // 如果資料庫連接失敗，終止程序
  }
})();
