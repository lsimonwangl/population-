
const express = require('express');
const router = express.Router();
const Record = require('../models/Record');

router.get('/total/:yyyymm', async (req, res) => {
  try {
    const yyyymm = parseInt(req.params.yyyymm);
    const result = await Record.aggregate([
      { $match: { statistic_yyyymm: yyyymm } },
      { $group: { _id: null, total: { $sum: "$divorce_pair" } } }
    ]);
    if (result.length === 0) return res.status(404).json({ message: `找不到 ${yyyymm} 月的離婚資料` });
    res.json({ total: result[0].total });
  } catch (err) {
    res.status(500).json({ message: '伺服器錯誤', error: err.message });
  }
});

/*router.get('/trend/:site_id', async (req, res) => {
  try {
    const site_id = req.params.site_id;
    const result = await Record.aggregate([
      { $match: { site_id } },
      { $sort: { statistic_yyyymm: 1 } },
      { $project: { month: "$statistic_yyyymm", total: "$divorce_pair" } }
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: '伺服器錯誤', error: err.message });
  }
});*/

router.get('/trend/:site_id/:village', async (req, res) => {
  try {
    const {site_id, village} = req.params;
    const result = await Record.aggregate([
      { $match: { site_id, village } }, // 過濾指定地區
      {
        $group: {
          _id: "$statistic_yyyymm",            // 以月份作為分組 key
          total: { $sum: "$divorce_pair" }     // 加總當月的離婚對數
        }
      },
      {
        $project: {
          month: "$_id", // 重新命名欄位
          total: 1,
          _id: 0
        }
      },
      { $sort: { month: 1 } } // 按月份升冪排序
    ]);

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: '伺服器錯誤', error: err.message });
  }
});

module.exports = router;
