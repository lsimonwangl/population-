
// ===== 死亡統計相關的 API 路由檔案 =====
// 這個檔案處理所有與死亡統計相關的 HTTP 請求

const express = require('express');
const router = express.Router();

// 引入資料庫連接池
const { pool } = require('../config/database');

// ===== API 端點：查詢某月份的死亡總數 =====
router.get('/total/:yyyymm', async (req, res) => {
  try {
    const yyyymm = parseInt(req.params.yyyymm);

    const [rows] = await pool.query(
      'SELECT SUM(death_total) as total FROM records WHERE statistic_yyyymm = ?',
      [yyyymm]
    );

    if (rows[0].total === null) {
      return res.status(404).json({ message: `找不到 ${yyyymm} 月的死亡資料` });
    }

    res.json({ total: rows[0].total });
  } catch (err) {
    res.status(500).json({ message: '伺服器錯誤', error: err.message });
  }
});

// ===== API 端點：查詢某村里的死亡男女比例 =====
router.get('/ratio/:village', async (req, res) => {
  try {
    const { village } = req.params;

    const [rows] = await pool.query(
      `SELECT
        site_id, village, statistic_yyyymm, death_m, death_f,
        CASE
          WHEN death_f = 0 THEN NULL
          ELSE ROUND(death_m / death_f, 2)
        END as ratio
       FROM records
       WHERE village = ?
       ORDER BY site_id, statistic_yyyymm`,
      [village]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: '找不到該村里資料' });
    }

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: '伺服器錯誤', error: err.message });
  }
});

// ===== API 端點：查詢某地區的死亡趨勢 =====
router.get('/trend/:site_id/:village', async (req, res) => {
  try {
    const { site_id, village } = req.params;

    const [rows] = await pool.query(
      `SELECT statistic_yyyymm as month, SUM(death_total) as total
       FROM records
       WHERE site_id = ? AND village = ?
       GROUP BY statistic_yyyymm
       ORDER BY statistic_yyyymm`,
      [site_id, village]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: '找不到該地區的村里資料' });
    }

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: '伺服器錯誤', error: err.message });
  }
});

module.exports = router;
