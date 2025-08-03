<template>
  <div class="p-8 bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">GridTable 组件测试</h1>
      <!-- GridTable 表格 -->
      <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 class="text-xl font-semibold mb-4 text-gray-800">基金數據表格 (GridTable)</h2>
        <GridTable
          :columns="gridColumns"
          :data="tableData"
        />
      </div>
      <!-- GridTableTest 表格 -->
      <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 class="text-xl font-semibold mb-4 text-gray-800">基金數據表格 (GridTableTest)</h2>
        <GridTableTest
          :columns="gridColumns"
          :data="tableData"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import GridTable from '../components/GridTable.vue'
import GridTableTest from '../components/GridTableTest.vue'

// 表格数据
const tableData = ref([
  {
    fundCode: 'F001',
    fundName: '台灣高股息基金台灣高股息基金',
    fundStatus: '活躍',
    accountDate: '2024-01-15',
    accountAmount: '¥50,000',
    inventoryUnits: 1000,
    distributionType: 'cash',
    dividendCurrency: 'TWD',
    navPerUnit: '15.25'
  },
  {
    fundCode: 'F002',
    fundName: '新興市場債券基金',
    fundStatus: '暫停',
    accountDate: '2024-01-16',
    accountAmount: '¥75,000',
    inventoryUnits: 1500,
    distributionType: 'reinvest',
    dividendCurrency: 'USD',
    navPerUnit: '12.80'
  },
  {
    fundCode: 'F003',
    fundName: '科技成長基金',
    fundStatus: '活躍',
    accountDate: '2024-01-17',
    accountAmount: '¥120,000',
    inventoryUnits: 2000,
    distributionType: 'cash',
    dividendCurrency: 'USD',
    navPerUnit: '18.75'
  },
  {
    fundCode: 'F004',
    fundName: '歐洲精選基金',
    fundStatus: '關閉',
    accountDate: '2024-01-18',
    accountAmount: '¥88,000',
    inventoryUnits: 1200,
    distributionType: 'reinvest',
    dividendCurrency: 'EUR',
    navPerUnit: '14.60'
  },
  {
    fundCode: 'F005',
    fundName: '亞洲小型股基金',
    fundStatus: '活躍',
    accountDate: '2024-01-19',
    accountAmount: '¥95,000',
    inventoryUnits: 1800,
    distributionType: 'cash',
    dividendCurrency: 'TWD',
    navPerUnit: '16.80'
  },
  {
    fundCode: 'F006',
    fundName: '美國大型成長股基金',
    fundStatus: '活躍',
    accountDate: '2024-01-20',
    accountAmount: '¥150,000',
    inventoryUnits: 2500,
    distributionType: 'cash',
    dividendCurrency: 'USD',
    navPerUnit: '22.50'
  },
  {
    fundCode: 'F007',
    fundName: '日本中小型股基金',
    fundStatus: '暫停',
    accountDate: '2024-01-21',
    accountAmount: '¥65,000',
    inventoryUnits: 1300,
    distributionType: 'reinvest',
    dividendCurrency: 'JPY',
    navPerUnit: '11.20'
  },
  {
    fundCode: 'F008',
    fundName: '新興亞洲股票基金',
    fundStatus: '活躍',
    accountDate: '2024-01-22',
    accountAmount: '¥110,000',
    inventoryUnits: 2200,
    distributionType: 'cash',
    dividendCurrency: 'USD',
    navPerUnit: '17.80'
  },
  {
    fundCode: 'F009',
    fundName: '全球債券基金',
    fundStatus: '活躍',
    accountDate: '2024-01-23',
    accountAmount: '¥85,000',
    inventoryUnits: 1700,
    distributionType: 'reinvest',
    dividendCurrency: 'USD',
    navPerUnit: '13.40'
  },
  {
    fundCode: 'F010',
    fundName: '拉丁美洲股票基金',
    fundStatus: '關閉',
    accountDate: '2024-01-24',
    accountAmount: '¥72,000',
    inventoryUnits: 1440,
    distributionType: 'cash',
    dividendCurrency: 'USD',
    navPerUnit: '16.10'
  },
  {
    fundCode: 'F011',
    fundName: '中國A股基金',
    fundStatus: '活躍',
    accountDate: '2024-01-25',
    accountAmount: '¥98,000',
    inventoryUnits: 1960,
    distributionType: 'cash',
    dividendCurrency: 'CNY',
    navPerUnit: '19.20'
  },
  {
    fundCode: 'F012',
    fundName: '印度股票基金',
    fundStatus: '暫停',
    accountDate: '2024-01-26',
    accountAmount: '¥125,000',
    inventoryUnits: 2500,
    distributionType: 'reinvest',
    dividendCurrency: 'INR',
    navPerUnit: '14.80'
  },
  {
    fundCode: 'F013',
    fundName: '澳洲資源股基金',
    fundStatus: '活躍',
    accountDate: '2024-01-27',
    accountAmount: '¥89,000',
    inventoryUnits: 1780,
    distributionType: 'cash',
    dividendCurrency: 'AUD',
    navPerUnit: '20.30'
  },
  {
    fundCode: 'F014',
    fundName: '韓國科技基金',
    fundStatus: '活躍',
    accountDate: '2024-01-28',
    accountAmount: '¥105,000',
    inventoryUnits: 2100,
    distributionType: 'cash',
    dividendCurrency: 'KRW',
    navPerUnit: '18.90'
  },
  {
    fundCode: 'F015',
    fundName: '英國股票收益基金',
    fundStatus: '關閉',
    accountDate: '2024-01-29',
    accountAmount: '¥76,000',
    inventoryUnits: 1520,
    distributionType: 'reinvest',
    dividendCurrency: 'GBP',
    navPerUnit: '12.70'
  }
])

// GridTable 列配置
const gridColumns = ref([
  { 
    key: 'fundCode', 
    title: '基金代碼', 
    width: '80px',
    align: 'left',
    // minWidth: '120px'
  },
  { 
    key: 'fundName', 
    title: '基金名稱', 
    width: '200px',
    align: 'left',
    // minWidth: '120px'
  },
  { 
    key: 'fundStatus', 
    title: '狀態', 
    width: '80px',
    align: 'left',
    // minWidth: '100px'
  },
  { 
    key: 'accountDate', 
    title: '帳務日期', 
    width: '120px',
    align: 'left',
    // minWidth: '120px'
  },
  { 
    key: 'accountAmount', 
    title: '帳務金額', 
    width: '120px',
    align: 'right',
    // minWidth: '120px'
  },
  { 
    key: 'inventoryUnits', 
    title: '庫存單位數', 
    width: '120px',
    align: 'right'
    // minWidth: '120px'
  },
  { 
    key: 'distributionType', 
    title: '配息方式', 
    width: '100px',
    align: 'left',
    // minWidth: '120px'
  },
  { 
    key: 'dividendCurrency', 
    title: '配息幣別', 
    width: '100px',
    align: 'left',
    // minWidth: '120px'
  },
  { 
    key: 'navPerUnit', 
    title: '單位淨值', 
    width: '100px',
    align: 'right',
    // minWidth: '120px'
  }
])
</script>

<style scoped>
/* 額外的樣式可以在這裡添加 */
</style>
