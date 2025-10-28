
// ===== 出生統計相關的 API 路由檔案 =====
// 這個檔案處理所有與出生統計相關的 HTTP 請求

// 引入 Express 路由器
const express = require('express');
const router = express.Router();

// 引入資料庫連接池
const { pool } = require('../config/database');

// ===== API 端點：查詢某月份的出生總數 =====
// 路由：GET /api/birth/total/:yyyymm
// 參數：yyyymm（年月，如 10810）
router.get('/total/:yyyymm', async (req, res) => {
  try {
    // 從 URL 參數中提取年月，並轉換為數字
    const yyyymm = parseInt(req.params.yyyymm);

    // 使用 SQL 查詢該月份的出生總數
    const [rows] = await pool.query(
      'SELECT SUM(birth_total) as total FROM records WHERE statistic_yyyymm = ?',
      [yyyymm]
    );

    // 如果沒有找到資料，回傳 404 錯誤
    if (rows[0].total === null) {
      return res.status(404).json({ message: `找不到 ${yyyymm} 月的出生資料` });
    }

    // 回傳成功結果
    res.json({ total: rows[0].total });
  } catch (err) {
    // 捕捉任何錯誤並回傳 500 伺服器錯誤
    res.status(500).json({ message: '伺服器錯誤', error: err.message });
  }
});

// ===== API 端點：查詢某月份某村里的出生男女比例 =====
// 路由：GET /api/birth/ratio/:yyyymm/:village
// 參數：yyyymm（年月，如 10810）、village（村里名稱）
// 功能：查詢指定年月和村里的男女出生人數及比例
router.get('/ratio/:yyyymm/:village', async (req, res) => {
  try {
    // 從 URL 參數中解構出年月和村里名稱
    const { yyyymm, village } = req.params;

    // 查詢符合條件的單一記錄
    const [rows] = await pool.query(
      'SELECT birth_total_m, birth_total_f FROM records WHERE statistic_yyyymm = ? AND village = ?',
      [parseInt(yyyymm), village]
    );

    // 如果沒有找到資料，回傳 404 錯誤
    if (rows.length === 0) {
      return res.status(404).json({ message: '找不到該村里資料' });
    }

    const result = rows[0];

    // 回傳男女出生人數和比例
    res.json({
      male: result.birth_total_m,        // 男性出生人數
      female: result.birth_total_f,      // 女性出生人數
      ratio: result.birth_total_m / (result.birth_total_f || 1) // 男女比例（避免除以零）
    });
  } catch (err) {
    // 捕捉任何錯誤並回傳 500 伺服器錯誤
    res.status(500).json({ message: '伺服器錯誤', error: err.message });
  }
});

// ===== API 端點：查詢某地區的出生趨勢 =====
// 路由：GET /api/birth/trend/:site_id
// 參數：site_id（地區代碼，如 63000010）
// 功能：查詢指定地區各月份的出生總數趨勢，用於繪製趨勢圖表
router.get('/trend/:site_id', async (req, res) => {
  try {
    // 從 URL 參數中提取地區代碼
    const site_id = req.params.site_id;

    // 使用 SQL GROUP BY 查詢趨勢資料
    const [rows] = await pool.query(
      `SELECT statistic_yyyymm as month, SUM(birth_total) as total
       FROM records
       WHERE site_id = ?
       GROUP BY statistic_yyyymm
       ORDER BY statistic_yyyymm`,
      [site_id]
    );

    // 回傳趨勢資料陣列
    // 格式：[{ month: 10810, total: 25 }, { month: 10811, total: 30 }, ...]
    res.json(rows);
  } catch (err) {
    // 捕捉任何錯誤並回傳 500 伺服器錯誤
    res.status(500).json({ message: '伺服器錯誤', error: err.message });
  }
});

// ===== 匯出路由器 =====
// 將此路由器匯出，供主應用程式使用
module.exports = router;
