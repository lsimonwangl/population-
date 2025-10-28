
// ===== 人口記錄管理相關的 API 路由檔案 =====
// 這個檔案處理所有與人口記錄 CRUD 操作相關的 HTTP 請求
// 包含新增、查詢、修改、刪除等基本功能

// 引入 Express 路由器
const express = require('express');
const router = express.Router();

// 引入人口記錄資料模型
const Record = require('../models/Record');

// ===== API 端點：新增人口記錄 =====
// 路由：POST /api/records
// 功能：建立新的人口統計記錄
// 請求體：包含完整的記錄資料（JSON 格式）
router.post('/', async (req, res) => {
  try {
    // 使用請求體的資料建立新記錄
    const saved = await Record.create(req.body);

    // 回傳建立成功的記錄，HTTP 狀態碼 201（Created）
    res.status(201).json(saved);
  } catch (err) {
    // 如果資料驗證失敗或其他錯誤，回傳 400（Bad Request）
    res.status(400).json({ message: err.message });
  }
});

// ===== API 端點：獲取記錄總數 =====
// 路由：GET /api/records/count
// 功能：查詢資料庫中的記錄總數，用於分頁計算
router.get('/count', async (req, res) => {
  try {
    // 計算資料庫中的記錄總數
    const count = await Record.count();

    // 回傳總數
    res.json({ count });
  } catch (err) {
    // 伺服器錯誤
    res.status(500).json({ message: err.message });
  }
});

// ===== API 端點：分頁查詢所有記錄 =====
// 路由：GET /api/records?page=1
// 功能：分頁查詢人口記錄，每頁顯示 10 筆資料
// 查詢參數：page（頁碼，預設為 1）
router.get('/', async (req, res) => {
  // 從查詢參數中取得頁碼，預設為第 1 頁
  const page = parseInt(req.query.page) || 1;
  // 每頁顯示的記錄數量
  const limit = 10;

  try {
    // 查詢記錄，使用分頁
    const records = await Record.findWithPagination(page, limit);
    // 回傳查詢結果
    res.json(records);
  } catch (err) {
    // 伺服器錯誤
    res.status(500).json({ message: err.message });
  }
});

// ===== API 端點：查詢特定月份的記錄 =====
// 路由：GET /api/records/month/:yyyymm
// 參數：yyyymm（年月，如 10810 代表民國 108 年 10 月）
// 功能：查詢指定年月的所有人口統計記錄
router.get('/month/:yyyymm', async (req, res) => {
  try {
    // 查詢符合指定年月的所有記錄
    const records = await Record.findByMonth(parseInt(req.params.yyyymm));

    // 回傳查詢結果
    res.json(records);
  } catch (err) {
    // 伺服器錯誤
    res.status(500).json({ message: err.message });
  }
});

// 使用分組查詢處理同名村里
router.get('/village/:name', async (req, res) => {
  const villageName = req.params.name;

  try {
    const sites = await Record.findByVillage(villageName);

    if (sites.length === 0) {
      return res.status(404).json({ message: '找不到該村里資料' });
    }

    res.json({
      village_name: villageName,
      total_sites: sites.length,
      sites: sites
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ===== API 端點：精確查詢特定地區的村里記錄 =====
// 路由：GET /api/records/village/:site_id/:village
// 參數：site_id（地區代碼）、village（村里名稱）
// 功能：根據地區代碼與村里名稱查詢，避免同名村里的混淆
router.get('/village/:site_id/:village', async (req, res) => {
  try {
    // 從 URL 參數中解構出地區代碼和村里名稱
    const { site_id, village } = req.params;

    // 使用雙重條件查詢：site_id + village
    const records = await Record.findBySiteAndVillage(site_id, village);

    // 如果找不到資料
    if (records.length === 0) {
      return res.status(404).json({ message: '找不到該地區的村里資料' });
    }

    // 回傳查詢結果
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: '伺服器錯誤', error: err.message });
  }
});

// ===== API 端點：更新記錄 =====
// 路由：PUT /api/records/:id
// 參數：id（記錄的 ID）
// 功能：更新指定 ID 的記錄資料
// 請求體：包含要更新的欄位資料（JSON 格式）
router.put('/:id', async (req, res) => {
  try {
    // 更新記錄
    const updated = await Record.updateById(req.params.id, req.body);

    // 如果找不到要更新的記錄，回傳 404 錯誤
    if (!updated) return res.status(404).json({ message: "Record not found" });

    // 回傳更新後的記錄
    res.json(updated);
  } catch (err) {
    // 資料驗證錯誤或其他錯誤
    res.status(400).json({ message: err.message });
  }
});

// ===== API 端點：查詢單一記錄 =====
// 路由：GET /api/records/:id
// 參數：id（記錄的 ID）
// 功能：根據 ID 查詢特定的記錄
router.get('/:id', async (req, res) => {
  try {
    // 根據 ID 查詢記錄
    const record = await Record.findById(req.params.id);

    // 如果找不到記錄，回傳 404 錯誤
    if (!record) return res.status(404).json({ message: 'Record not found' });

    // 回傳查詢到的記錄
    res.json(record);
  } catch (err) {
    // 伺服器錯誤
    res.status(500).json({ message: err.message });
  }
});

// ===== API 端點：刪除記錄 =====
// 路由：DELETE /api/records/:id
// 參數：id（記錄的 ID）
// 功能：刪除指定 ID 的記錄
router.delete('/:id', async (req, res) => {
  try {
    // 根據 ID 刪除記錄
    const deleted = await Record.deleteById(req.params.id);

    // 如果找不到要刪除的記錄，回傳 404 錯誤
    if (!deleted) return res.status(404).json({ message: "Record not found" });

    // 回傳刪除成功的訊息
    res.json({ message: "Record deleted" });
  } catch (err) {
    // 伺服器錯誤
    res.status(500).json({ message: err.message });
  }
});

// ===== 匯出路由器 =====
// 將此路由器匯出，供主應用程式使用
module.exports = router;
