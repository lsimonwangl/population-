// ===== 輸入驗證中間件 =====
// 使用 Joi 進行數據驗證，防止無效數據和 SQL injection

const Joi = require('joi');

// ===== 記錄資料驗證規則 =====
// 定義所有欄位的驗證規則
const recordSchema = Joi.object({
  // 統計年月：格式 YYYYMM，範圍 190001-209912
  statistic_yyyymm: Joi.number()
    .integer()
    .min(190001)
    .max(209912)
    .required()
    .messages({
      'number.base': 'statistic_yyyymm 必須是數字',
      'number.min': 'statistic_yyyymm 不能早於 190001',
      'number.max': 'statistic_yyyymm 不能晚於 209912',
      'any.required': 'statistic_yyyymm 是必填欄位'
    }),

  // 行政區代碼
  district_code: Joi.string()
    .max(50)
    .trim()
    .required()
    .messages({
      'string.base': 'district_code 必須是字串',
      'string.max': 'district_code 長度不能超過 50 字元',
      'any.required': 'district_code 是必填欄位'
    }),

  // 站點 ID
  site_id: Joi.string()
    .max(50)
    .trim()
    .required()
    .messages({
      'string.base': 'site_id 必須是字串',
      'string.max': 'site_id 長度不能超過 50 字元',
      'any.required': 'site_id 是必填欄位'
    }),

  // 村里名稱
  village: Joi.string()
    .max(100)
    .trim()
    .required()
    .messages({
      'string.base': 'village 必須是字串',
      'string.max': 'village 長度不能超過 100 字元',
      'any.required': 'village 是必填欄位'
    }),

  // 出生總數（非負整數，預設 0）
  birth_total: Joi.number()
    .integer()
    .min(0)
    .default(0)
    .messages({
      'number.base': 'birth_total 必須是數字',
      'number.integer': 'birth_total 必須是整數',
      'number.min': 'birth_total 不能是負數'
    }),

  // 出生男性總數
  birth_total_m: Joi.number()
    .integer()
    .min(0)
    .default(0)
    .messages({
      'number.base': 'birth_total_m 必須是數字',
      'number.integer': 'birth_total_m 必須是整數',
      'number.min': 'birth_total_m 不能是負數'
    }),

  // 出生女性總數
  birth_total_f: Joi.number()
    .integer()
    .min(0)
    .default(0)
    .messages({
      'number.base': 'birth_total_f 必須是數字',
      'number.integer': 'birth_total_f 必須是整數',
      'number.min': 'birth_total_f 不能是負數'
    }),

  // 死亡總數
  death_total: Joi.number()
    .integer()
    .min(0)
    .default(0)
    .messages({
      'number.base': 'death_total 必須是數字',
      'number.integer': 'death_total 必須是整數',
      'number.min': 'death_total 不能是負數'
    }),

  // 死亡男性數
  death_m: Joi.number()
    .integer()
    .min(0)
    .default(0)
    .messages({
      'number.base': 'death_m 必須是數字',
      'number.integer': 'death_m 必須是整數',
      'number.min': 'death_m 不能是負數'
    }),

  // 死亡女性數
  death_f: Joi.number()
    .integer()
    .min(0)
    .default(0)
    .messages({
      'number.base': 'death_f 必須是數字',
      'number.integer': 'death_f 必須是整數',
      'number.min': 'death_f 不能是負數'
    }),

  // 結婚對數
  marry_pair: Joi.number()
    .integer()
    .min(0)
    .default(0)
    .messages({
      'number.base': 'marry_pair 必須是數字',
      'number.integer': 'marry_pair 必須是整數',
      'number.min': 'marry_pair 不能是負數'
    }),

  // 離婚對數
  divorce_pair: Joi.number()
    .integer()
    .min(0)
    .default(0)
    .messages({
      'number.base': 'divorce_pair 必須是數字',
      'number.integer': 'divorce_pair 必須是整數',
      'number.min': 'divorce_pair 不能是負數'
    })
});

// ===== 更新記錄驗證規則（允許部分更新）=====
// 與 recordSchema 相同，但所有欄位都是選填
const updateRecordSchema = Joi.object({
  statistic_yyyymm: Joi.number().integer().min(190001).max(209912),
  district_code: Joi.string().max(50).trim(),
  site_id: Joi.string().max(50).trim(),
  village: Joi.string().max(100).trim(),
  birth_total: Joi.number().integer().min(0),
  birth_total_m: Joi.number().integer().min(0),
  birth_total_f: Joi.number().integer().min(0),
  death_total: Joi.number().integer().min(0),
  death_m: Joi.number().integer().min(0),
  death_f: Joi.number().integer().min(0),
  marry_pair: Joi.number().integer().min(0),
  divorce_pair: Joi.number().integer().min(0)
}).min(1); // 至少要有一個欄位被更新

// ===== ID 參數驗證 =====
const idParamSchema = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'ID 必須是數字',
      'number.integer': 'ID 必須是整數',
      'number.positive': 'ID 必須是正數',
      'any.required': 'ID 是必填參數'
    })
});

// ===== 查詢參數驗證 =====
const queryParamsSchema = Joi.object({
  // 統計年月查詢
  statistic_yyyymm: Joi.number().integer().min(190001).max(209912),

  // 站點 ID 查詢
  site_id: Joi.string().max(50).trim(),

  // 村里名稱查詢
  village: Joi.string().max(100).trim(),

  // 分頁參數
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),

  // 排序參數
  sortBy: Joi.string().valid('statistic_yyyymm', 'birth_total', 'death_total', 'marry_pair', 'divorce_pair', 'created_at'),
  sortOrder: Joi.string().valid('asc', 'desc', 'ASC', 'DESC').default('desc')
}).options({ allowUnknown: true }); // 允許其他未定義的查詢參數

// ===== 驗證中間件函數 =====

/**
 * 驗證新增記錄的請求數據
 */
const validateRecord = (req, res, next) => {
  const { error, value } = recordSchema.validate(req.body, {
    abortEarly: false, // 返回所有錯誤，而不是第一個錯誤
    stripUnknown: true  // 移除未定義的欄位
  });

  if (error) {
    return res.status(400).json({
      success: false,
      error: '資料驗證失敗',
      details: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }

  // 將驗證後的數據存到 req.validatedData
  req.validatedData = value;
  next();
};

/**
 * 驗證更新記錄的請求數據
 */
const validateUpdateRecord = (req, res, next) => {
  const { error, value } = updateRecordSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    return res.status(400).json({
      success: false,
      error: '資料驗證失敗',
      details: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }

  req.validatedData = value;
  next();
};

/**
 * 驗證 ID 參數
 */
const validateIdParam = (req, res, next) => {
  const { error, value } = idParamSchema.validate(req.params);

  if (error) {
    return res.status(400).json({
      success: false,
      error: 'ID 參數無效',
      details: error.details.map(detail => detail.message)
    });
  }

  req.validatedParams = value;
  next();
};

/**
 * 驗證查詢參數
 */
const validateQueryParams = (req, res, next) => {
  const { error, value } = queryParamsSchema.validate(req.query, {
    abortEarly: false,
    stripUnknown: false
  });

  if (error) {
    return res.status(400).json({
      success: false,
      error: '查詢參數無效',
      details: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }

  req.validatedQuery = value;
  next();
};

// ===== 匯出驗證中間件 =====
module.exports = {
  validateRecord,
  validateUpdateRecord,
  validateIdParam,
  validateQueryParams
};
