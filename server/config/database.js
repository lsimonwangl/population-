
// ===== MySQL 資料庫連接配置檔案 =====
// 這個檔案負責建立和管理 MySQL 資料庫連接池

require('dotenv').config();
const mysql = require('mysql2/promise');

// 建立資料庫連接池
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'population',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 初始化資料表結構
const initDatabase = async () => {
  try {
    const connection = await pool.getConnection();

    // 建立 records 資料表
    await connection.query(`
      CREATE TABLE IF NOT EXISTS records (
        id INT AUTO_INCREMENT PRIMARY KEY,
        statistic_yyyymm INT,
        district_code VARCHAR(50),
        site_id VARCHAR(50),
        village VARCHAR(100),
        birth_total INT DEFAULT 0,
        birth_total_m INT DEFAULT 0,
        birth_total_f INT DEFAULT 0,
        death_total INT DEFAULT 0,
        death_m INT DEFAULT 0,
        death_f INT DEFAULT 0,
        marry_pair INT DEFAULT 0,
        divorce_pair INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_statistic_yyyymm (statistic_yyyymm),
        INDEX idx_site_id (site_id),
        INDEX idx_village (village)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    connection.release();
    console.log('MySQL database initialized successfully');
  } catch (err) {
    console.error('Error initializing database:', err);
    throw err;
  }
};

module.exports = { pool, initDatabase };
