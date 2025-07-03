
const express = require('express');
const router = express.Router();
const Record = require('../models/Record');

router.get('/total/:yyyymm', async (req, res) => {
  try {
    const yyyymm = parseInt(req.params.yyyymm);
    const result = await Record.aggregate([
      { $match: { statistic_yyyymm: yyyymm } },
      { $group: { _id: null, total: { $sum: "$marry_pair" } } }
    ]);
    if (result.length === 0) return res.status(404).json({ message: `找不到 ${yyyymm} 月的結婚資料` });
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
      { $project: { month: "$statistic_yyyymm", total: "$marry_pair" } }
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
      { $match: { site_id, village } },
      {
        $group: {
          _id: "$statistic_yyyymm", // 依月份分組
          total: { $sum: "$marry_pair" } // 每月結婚對數加總
        }
      },
      {
        $project: {
          month: "$_id",
          total: 1,
          _id: 0
        }
      },
      {
        $sort: { month: 1 } // 照月份升冪排序
      }
    ]);

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: '伺服器錯誤', error: err.message });
  }
});


module.exports = router;
