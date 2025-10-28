
// ===== MySQL 資料模型定義檔案 =====
// 這個檔案定義了人口資料的資料庫操作函數

const { pool } = require('../config/database');

// ===== 資料庫操作函數 =====

// 建立新記錄
const create = async (data) => {
  const [result] = await pool.query(
    `INSERT INTO records (
      statistic_yyyymm, district_code, site_id, village,
      birth_total, birth_total_m, birth_total_f,
      death_total, death_m, death_f,
      marry_pair, divorce_pair
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.statistic_yyyymm, data.district_code, data.site_id, data.village,
      data.birth_total || 0, data.birth_total_m || 0, data.birth_total_f || 0,
      data.death_total || 0, data.death_m || 0, data.death_f || 0,
      data.marry_pair || 0, data.divorce_pair || 0
    ]
  );
  return { id: result.insertId, ...data };
};

// 計算總記錄數
const count = async () => {
  const [rows] = await pool.query('SELECT COUNT(*) as count FROM records');
  return rows[0].count;
};

// 分頁查詢所有記錄
const findWithPagination = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  const [rows] = await pool.query(
    'SELECT * FROM records ORDER BY id DESC LIMIT ? OFFSET ?',
    [limit, offset]
  );
  return rows;
};

// 根據 ID 查詢單一記錄
const findById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM records WHERE id = ?', [id]);
  return rows[0] || null;
};

// 根據年月查詢記錄
const findByMonth = async (yyyymm) => {
  const [rows] = await pool.query(
    'SELECT * FROM records WHERE statistic_yyyymm = ?',
    [yyyymm]
  );
  return rows;
};

// 根據村里名稱查詢（支持同名村里分組）
const findByVillage = async (villageName) => {
  const [rows] = await pool.query(
    `SELECT * FROM records
     WHERE village = ?
     ORDER BY site_id, statistic_yyyymm`,
    [villageName]
  );

  // 按 site_id 分組
  const grouped = {};
  rows.forEach(row => {
    if (!grouped[row.site_id]) {
      grouped[row.site_id] = {
        site_id: row.site_id,
        district_code: row.district_code,
        village: row.village,
        records: []
      };
    }
    grouped[row.site_id].records.push(row);
  });

  return Object.values(grouped);
};

// 根據地區代碼和村里名稱查詢
const findBySiteAndVillage = async (siteId, village) => {
  const [rows] = await pool.query(
    'SELECT * FROM records WHERE site_id = ? AND village = ? ORDER BY statistic_yyyymm',
    [siteId, village]
  );
  return rows;
};

// 更新記錄
const updateById = async (id, data) => {
  const [result] = await pool.query(
    `UPDATE records SET
      statistic_yyyymm = ?, district_code = ?, site_id = ?, village = ?,
      birth_total = ?, birth_total_m = ?, birth_total_f = ?,
      death_total = ?, death_m = ?, death_f = ?,
      marry_pair = ?, divorce_pair = ?
     WHERE id = ?`,
    [
      data.statistic_yyyymm, data.district_code, data.site_id, data.village,
      data.birth_total, data.birth_total_m, data.birth_total_f,
      data.death_total, data.death_m, data.death_f,
      data.marry_pair, data.divorce_pair,
      id
    ]
  );

  if (result.affectedRows === 0) {
    return null;
  }

  return findById(id);
};

// 刪除記錄
const deleteById = async (id) => {
  const record = await findById(id);
  if (!record) {
    return null;
  }

  await pool.query('DELETE FROM records WHERE id = ?', [id]);
  return record;
};

// 統計查詢 - 按年月分組的出生數
const getBirthStatsByMonth = async () => {
  const [rows] = await pool.query(
    `SELECT statistic_yyyymm, SUM(birth_total) as total
     FROM records
     GROUP BY statistic_yyyymm
     ORDER BY statistic_yyyymm`
  );
  return rows;
};

// 統計查詢 - 按年月分組的死亡數
const getDeathStatsByMonth = async () => {
  const [rows] = await pool.query(
    `SELECT statistic_yyyymm, SUM(death_total) as total
     FROM records
     GROUP BY statistic_yyyymm
     ORDER BY statistic_yyyymm`
  );
  return rows;
};

// 統計查詢 - 按年月分組的結婚數
const getMarryStatsByMonth = async () => {
  const [rows] = await pool.query(
    `SELECT statistic_yyyymm, SUM(marry_pair) as total
     FROM records
     GROUP BY statistic_yyyymm
     ORDER BY statistic_yyyymm`
  );
  return rows;
};

// 統計查詢 - 按年月分組的離婚數
const getDivorceStatsByMonth = async () => {
  const [rows] = await pool.query(
    `SELECT statistic_yyyymm, SUM(divorce_pair) as total
     FROM records
     GROUP BY statistic_yyyymm
     ORDER BY statistic_yyyymm`
  );
  return rows;
};

// 總計統計
const getTotalStats = async () => {
  const [rows] = await pool.query(
    `SELECT
      SUM(birth_total) as total_births,
      SUM(death_total) as total_deaths,
      SUM(marry_pair) as total_marriages,
      SUM(divorce_pair) as total_divorces
     FROM records`
  );
  return rows[0];
};

module.exports = {
  create,
  count,
  findWithPagination,
  findById,
  findByMonth,
  findByVillage,
  findBySiteAndVillage,
  updateById,
  deleteById,
  getBirthStatsByMonth,
  getDeathStatsByMonth,
  getMarryStatsByMonth,
  getDivorceStatsByMonth,
  getTotalStats
};
