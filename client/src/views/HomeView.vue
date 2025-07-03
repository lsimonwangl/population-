
<script setup>
/**
 * 主選單配置陣列
 * 定義系統所有功能的分組和導航資訊
 * 每個分組包含標題和功能項目清單
 */
const menu = [
  {
    // 基本資料管理功能分組
    title: '基本功能',
    items: [
      { label: '新增一筆紀錄', path: '/crud/create' },
      //{ label: '查詢全部資料（分頁）', path: '/crud/list' },
      { label: '查詢特定村里資料', path: '/crud/village' },
      { label: '刪除資料', path: '/crud/village' },
    ]
  },
  {
    // 出生相關統計功能分組
    title: '出生統計功能',
    items: [
      { label: '查詢某月份的出生總數', path: '/birth/total' },
      { label: '查詢某地區的出生趨勢', path: '/birth/trend' }
    ]
  },
  {
    // 死亡相關統計功能分組
    title: '死亡統計功能',
    items: [
      { label: '查詢某月份的死亡總數', path: '/death/total' },
      { label: '查詢某村里的死亡趨勢', path: '/death/trend' }
    ]
  },
  {
    // 結婚相關統計功能分組
    title: '婚姻統計功能',
    items: [
      { label: '查詢某月的結婚對數統計', path: '/marry/total' },
      { label: '查詢某地區的婚姻趨勢', path: '/marry/trend' }
    ]
  },
  {
    // 離婚相關統計功能分組
    title: '離婚統計功能',
    items: [
      { label: '查詢某月的離婚對數統計', path: '/divorce/total' },
      { label: '查詢某地區的離婚趨勢', path: '/divorce/trend' }
    ]
  }
]
</script>

<template>
  <div class="home">
    <!-- 動態生成選單區塊：根據 menu 陣列迴圈產生各功能分組 -->
    <section v-for="(group, index) in menu" :key="index">
      <!-- 功能分組標題 -->
      <h2>{{ group.title }}</h2>

      <!-- 功能項目清單 -->
      <ul>
        <!-- 迴圈產生每個功能項目的連結 -->
        <li v-for="item in group.items" :key="item.label">
          <!-- Vue Router 連結：點擊後導航到對應頁面 -->
          <RouterLink :to="item.path">{{ item.label }}</RouterLink>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.home {
  display: flex;            /* 讓 section 橫向排列 */
  flex-wrap: wrap;          /* 換行排放（超過寬度會自動換行） */
  gap: 30px;                /* 每個 section 間距 */
  align-items: flex-start;  /* 上對齊（讓 h2 對齊） */
  padding: 20px;
  justify-content: center;
}
h1 {
  font-size: 24px;
  margin-bottom: 20px;
}
section {
  width: 250px;             /* 固定每組寬度 */
  margin-bottom: 30px;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s, transform 0.2s;
}
section:hover {
  background-color: #e2e4e3;
  transform: translateY(-2px);
}
h2 {
  font-size: 20px;
  margin-bottom: 10px;
}
ul {
  list-style: none;
  padding-left: 0;
}
li {
  margin-bottom: 6px;
}
a {
  color: teal;
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}
</style>
