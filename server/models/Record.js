
// ===== MongoDB 資料模型定義檔案 =====
// 這個檔案定義了人口資料的資料結構，就像是資料庫的藍圖

// 引入 Mongoose（MongoDB 的 Node.js 驅動程式）
const mongoose = require('mongoose');

// ===== 定義資料結構（Schema） =====
// Schema 定義了每筆記錄應該包含哪些欄位和資料類型
const recordSchema = new mongoose.Schema({
  // ===== 基本識別資訊 =====
  statistic_yyyymm: Number,    // 統計年月（如：10810 = 108年10月）
  district_code: String,       // 行政區代碼
  site_id: String,             // 地點 ID（唯一識別碼）
  village: String,             // 村里名稱

  // ===== 出生相關統計 =====
  birth_total: Number,         // 出生總數
  birth_total_m: Number,       // 男性出生數
  birth_total_f: Number,       // 女性出生數

  // ===== 死亡相關統計 =====
  death_total: Number,         // 死亡總數
  death_m: Number,             // 男性死亡數
  death_f: Number,             // 女性死亡數

  // ===== 婚姻相關統計 =====
  marry_pair: Number,          // 結婚對數
  divorce_pair: Number         // 離婚對數
}, {
  collection: 'records'        // 指定 MongoDB 中的集合名稱
});

// ===== 匯出模型 =====
// 將 Schema 轉換為可操作的 Model，並命名為 'Record'
// 這個 Model 可以用來進行資料庫的 CRUD 操作
module.exports = mongoose.model('Record', recordSchema);
