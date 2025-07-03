
const express = require('express');
const router = express.Router();
const Record = require('../models/Record');

router.get('/total/:yyyymm', async (req, res) => {
  try {
    const yyyymm = parseInt(req.params.yyyymm);
    const result = await Record.aggregate([
      { $match: { statistic_yyyymm: yyyymm } },
      { $group: { _id: null, total: { $sum: "$death_total" } } }
    ]);
    if (result.length === 0) return res.status(404).json({ message: `找不到 ${yyyymm} 月的死亡資料` });
    res.json({ total: result[0].total });
  } catch (err) {
    res.status(500).json({ message: '伺服器錯誤', error: err.message });
  }
});

/*router.get('/ratio/:yyyymm/:village', async (req, res) => {
  try {
    const { yyyymm, village } = req.params;
    const result = await Record.findOne({
      statistic_yyyymm: parseInt(yyyymm),
      village
    });
    if (!result) return res.status(404).json({ message: '找不到該村里資料' });
    res.json({
      male: result.death_m,
      female: result.death_f,
      ratio: result.death_m / (result.death_f || 1)
    });
  } catch (err) {
    res.status(500).json({ message: '伺服器錯誤', error: err.message });
  }
});*/
router.get('/ratio/:village', async (req, res) => {
  try {
    const { village } = req.params;

    const result = await Record.aggregate([
      { $match: { village } }, // 找到該村里名稱的所有紀錄（可能有多個 site_id）
      {
        $addFields: {
          ratio: {
            $cond: {
              if: { $eq: ["$death_f", 0] },
              then: null,
              else: { $round: [{ $divide: ["$death_m", "$death_f"] }, 2] }
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          site_id: 1,
          village: 1,
          statistic_yyyymm: 1,
          death_m: 1,
          death_f: 1,
          ratio: 1
        }
      },
      { $sort: { site_id: 1, statistic_yyyymm: 1 } } // 排序條件：先 site_id，再月份
    ]);

    if (result.length === 0) {
      return res.status(404).json({ message: '找不到該村里資料' });
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: '伺服器錯誤', error: err.message });
  }
});



router.get('/trend/:site_id/:village', async (req, res) => {
  try {
    const { site_id, village } = req.params;
    const result = await Record.aggregate([
      { $match: { site_id, village } },
      {
        $group: {
          _id: "$statistic_yyyymm",
          total: { $sum: "$death_total" }
        }
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          month: "$_id",
          total: 1,
          _id: 0
        }
      }
    ]);

    if (result.length === 0) {
      return res.status(404).json({ message: '找不到該地區的村里資料' });
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: '伺服器錯誤', error: err.message });
  }
});

module.exports = router;
