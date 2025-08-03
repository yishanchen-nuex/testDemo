<template>
  <div class="p-8 bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">自定义 Table 组件演示</h1>
      
      <!-- 基本表格 -->
      <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 class="text-xl font-semibold mb-4 text-gray-800">基金数据表格</h2>
        
        <ElTable
          ref="multipleTable"
          :data="tableData"
          :columns="tableColumns"
          stripe
          border
          :style="{ 
            'max-height': '80vh', 
            'min-height': '300px',
            'overflow-y': 'auto'
          }"
        >
          <!-- 自定义操作列 -->
          <template #operations="{ row, $index }">
            <button 
              @click="handleEdit(row, $index)" 
              class="text-blue-600 hover:text-blue-800 mr-2"
            >
              编辑
            </button>
            <button 
              @click="handleDelete(row, $index)" 
              class="text-red-600 hover:text-red-800"
            >
              删除
            </button>
          </template>
          
          <!-- 自定义状态列 -->
          <template #status="{ row }">
            <span 
              :class="getStatusClass(row.fundStatus)"
              class="px-2 py-1 rounded-full text-xs font-medium"
            >
              {{ getStatusText(row.fundStatus) }}
            </span>
          </template>
        </ElTable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import ElTable from '../components/ElTable.vue'

// 表格数据 - 增加更多测试数据
const tableData = ref([
  {
    fundCode: 'F001',
    fundName: '台灣高股息基金台灣高股息基金',
    fundStatus: 'active',
    accountDate: '2024-01-15',
    accountAmount: 50000,
    benchmarkDate: '2024-01-10',
    inventoryUnits: 1000,
    distributionType: 'cash',
    dividendCurrency: 'TWD',
    amountPerUnit: 0.5,
    dividendAmount: 500,
    distributionUnits: 1000,
    navPerUnit: 15.25,
    healthInsuranceFee: 100,
    accountNumber: '123456789',
    exchangeRate: 1.0,
    exchangeRateDate: '2024-01-15',
    reinvestmentDate: '2024-01-20'
  },
  {
    fundCode: 'F002',
    fundName: '新興市場債券基金',
    fundStatus: 'suspended',
    accountDate: '2024-01-16',
    accountAmount: 75000,
    benchmarkDate: '2024-01-11',
    inventoryUnits: 1500,
    distributionType: 'reinvest',
    dividendCurrency: 'USD',
    amountPerUnit: 0.3,
    dividendAmount: 450,
    distributionUnits: 1500,
    navPerUnit: 12.8,
    healthInsuranceFee: 150,
    accountNumber: '987654321',
    exchangeRate: 31.5,
    exchangeRateDate: '2024-01-16',
    reinvestmentDate: '2024-01-21'
  },
  {
    fundCode: 'F003',
    fundName: '科技成長基金',
    fundStatus: 'active',
    accountDate: '2024-01-17',
    accountAmount: 120000,
    benchmarkDate: '2024-01-12',
    inventoryUnits: 2000,
    distributionType: 'cash',
    dividendCurrency: 'USD',
    amountPerUnit: 0.8,
    dividendAmount: 1600,
    distributionUnits: 2000,
    navPerUnit: 18.75,
    healthInsuranceFee: 320,
    accountNumber: '456789123',
    exchangeRate: 31.2,
    exchangeRateDate: '2024-01-17',
    reinvestmentDate: '2024-01-22'
  },
  {
    fundCode: 'F004',
    fundName: '歐洲精選基金',
    fundStatus: 'closed',
    accountDate: '2024-01-18',
    accountAmount: 88000,
    benchmarkDate: '2024-01-13',
    inventoryUnits: 1200,
    distributionType: 'reinvest',
    dividendCurrency: 'EUR',
    amountPerUnit: 0.4,
    dividendAmount: 480,
    distributionUnits: 1200,
    navPerUnit: 14.6,
    healthInsuranceFee: 96,
    accountNumber: '789123456',
    exchangeRate: 33.8,
    exchangeRateDate: '2024-01-18',
    reinvestmentDate: '2024-01-23'
  },
  {
    fundCode: 'F005',
    fundName: '亞洲小型股基金',
    fundStatus: 'active',
    accountDate: '2024-01-19',
    accountAmount: 95000,
    benchmarkDate: '2024-01-14',
    inventoryUnits: 1800,
    distributionType: 'cash',
    dividendCurrency: 'TWD',
    amountPerUnit: 0.6,
    dividendAmount: 1080,
    distributionUnits: 1800,
    navPerUnit: 16.8,
    healthInsuranceFee: 190,
    accountNumber: '321654987',
    exchangeRate: 1.0,
    exchangeRateDate: '2024-01-19',
    reinvestmentDate: '2024-01-24'
  },
  {
    fundCode: 'F006',
    fundName: '美國大型成長股基金',
    fundStatus: 'active',
    accountDate: '2024-01-20',
    accountAmount: 150000,
    benchmarkDate: '2024-01-15',
    inventoryUnits: 2500,
    distributionType: 'cash',
    dividendCurrency: 'USD',
    amountPerUnit: 0.9,
    dividendAmount: 2250,
    distributionUnits: 2500,
    navPerUnit: 22.5,
    healthInsuranceFee: 450,
    accountNumber: '456123789',
    exchangeRate: 31.0,
    exchangeRateDate: '2024-01-20',
    reinvestmentDate: '2024-01-25'
  },
  {
    fundCode: 'F007',
    fundName: '日本中小型股基金',
    fundStatus: 'suspended',
    accountDate: '2024-01-21',
    accountAmount: 65000,
    benchmarkDate: '2024-01-16',
    inventoryUnits: 1300,
    distributionType: 'reinvest',
    dividendCurrency: 'JPY',
    amountPerUnit: 0.25,
    dividendAmount: 325,
    distributionUnits: 1300,
    navPerUnit: 11.2,
    healthInsuranceFee: 65,
    accountNumber: '789456123',
    exchangeRate: 0.21,
    exchangeRateDate: '2024-01-21',
    reinvestmentDate: '2024-01-26'
  },
  {
    fundCode: 'F008',
    fundName: '新興亞洲股票基金',
    fundStatus: 'active',
    accountDate: '2024-01-22',
    accountAmount: 110000,
    benchmarkDate: '2024-01-17',
    inventoryUnits: 2200,
    distributionType: 'cash',
    dividendCurrency: 'USD',
    amountPerUnit: 0.7,
    dividendAmount: 1540,
    distributionUnits: 2200,
    navPerUnit: 17.8,
    healthInsuranceFee: 308,
    accountNumber: '147258369',
    exchangeRate: 31.1,
    exchangeRateDate: '2024-01-22',
    reinvestmentDate: '2024-01-27'
  },
  {
    fundCode: 'F009',
    fundName: '全球債券基金',
    fundStatus: 'active',
    accountDate: '2024-01-23',
    accountAmount: 85000,
    benchmarkDate: '2024-01-18',
    inventoryUnits: 1700,
    distributionType: 'reinvest',
    dividendCurrency: 'USD',
    amountPerUnit: 0.35,
    dividendAmount: 595,
    distributionUnits: 1700,
    navPerUnit: 13.4,
    healthInsuranceFee: 119,
    accountNumber: '963852741',
    exchangeRate: 31.3,
    exchangeRateDate: '2024-01-23',
    reinvestmentDate: '2024-01-28'
  },
  {
    fundCode: 'F010',
    fundName: '拉丁美洲股票基金',
    fundStatus: 'closed',
    accountDate: '2024-01-24',
    accountAmount: 72000,
    benchmarkDate: '2024-01-19',
    inventoryUnits: 1440,
    distributionType: 'cash',
    dividendCurrency: 'USD',
    amountPerUnit: 0.45,
    dividendAmount: 648,
    distributionUnits: 1440,
    navPerUnit: 16.1,
    healthInsuranceFee: 129,
    accountNumber: '741852963',
    exchangeRate: 31.4,
    exchangeRateDate: '2024-01-24',
    reinvestmentDate: '2024-01-29'
  },
  {
    fundCode: 'F011',
    fundName: '中國A股基金',
    fundStatus: 'active',
    accountDate: '2024-01-25',
    accountAmount: 98000,
    benchmarkDate: '2024-01-20',
    inventoryUnits: 1960,
    distributionType: 'cash',
    dividendCurrency: 'CNY',
    amountPerUnit: 0.55,
    dividendAmount: 1078,
    distributionUnits: 1960,
    navPerUnit: 19.2,
    healthInsuranceFee: 215,
    accountNumber: '258147369',
    exchangeRate: 4.3,
    exchangeRateDate: '2024-01-25',
    reinvestmentDate: '2024-01-30'
  },
  {
    fundCode: 'F012',
    fundName: '印度股票基金',
    fundStatus: 'suspended',
    accountDate: '2024-01-26',
    accountAmount: 125000,
    benchmarkDate: '2024-01-21',
    inventoryUnits: 2500,
    distributionType: 'reinvest',
    dividendCurrency: 'INR',
    amountPerUnit: 0.2,
    dividendAmount: 500,
    distributionUnits: 2500,
    navPerUnit: 14.8,
    healthInsuranceFee: 100,
    accountNumber: '369258147',
    exchangeRate: 0.38,
    exchangeRateDate: '2024-01-26',
    reinvestmentDate: '2024-01-31'
  },
  {
    fundCode: 'F013',
    fundName: '澳洲資源股基金',
    fundStatus: 'active',
    accountDate: '2024-01-27',
    accountAmount: 89000,
    benchmarkDate: '2024-01-22',
    inventoryUnits: 1780,
    distributionType: 'cash',
    dividendCurrency: 'AUD',
    amountPerUnit: 0.6,
    dividendAmount: 1068,
    distributionUnits: 1780,
    navPerUnit: 20.3,
    healthInsuranceFee: 213,
    accountNumber: '852741963',
    exchangeRate: 20.8,
    exchangeRateDate: '2024-01-27',
    reinvestmentDate: '2024-02-01'
  },
  {
    fundCode: 'F014',
    fundName: '韓國科技基金',
    fundStatus: 'active',
    accountDate: '2024-01-28',
    accountAmount: 105000,
    benchmarkDate: '2024-01-23',
    inventoryUnits: 2100,
    distributionType: 'cash',
    dividendCurrency: 'KRW',
    amountPerUnit: 0.4,
    dividendAmount: 840,
    distributionUnits: 2100,
    navPerUnit: 18.9,
    healthInsuranceFee: 168,
    accountNumber: '159753486',
    exchangeRate: 0.024,
    exchangeRateDate: '2024-01-28',
    reinvestmentDate: '2024-02-02'
  },
  {
    fundCode: 'F015',
    fundName: '英國股票收益基金',
    fundStatus: 'closed',
    accountDate: '2024-01-29',
    accountAmount: 76000,
    benchmarkDate: '2024-01-24',
    inventoryUnits: 1520,
    distributionType: 'reinvest',
    dividendCurrency: 'GBP',
    amountPerUnit: 0.3,
    dividendAmount: 456,
    distributionUnits: 1520,
    navPerUnit: 12.7,
    healthInsuranceFee: 91,
    accountNumber: '486159753',
    exchangeRate: 38.9,
    exchangeRateDate: '2024-01-29',
    reinvestmentDate: '2024-02-03'
  }
])

// 表格列配置
const tableColumns = [
  { prop: 'select', label: '', width: '50', slot: 'selection' },
  { prop: 'fundCode', label: '基金代碼', width: '100' },
  { prop: 'fundName', label: '基金名稱', minWidth: 200 },
  { 
    prop: 'fundStatus', 
    label: '狀態', 
    width: '100', 
    slot: 'status'
  },
  { prop: 'accountDate', label: '帳務日期', width: '120' },
  { 
    prop: 'accountAmount', 
    label: '帳務金額', 
    width: '120',
  },
  { prop: 'inventoryUnits', label: '庫存單位數', width: '120' },
  { prop: 'distributionType', label: '配息方式', width: '100' },
  { prop: 'dividendCurrency', label: '配息幣別', width: '100' },
  { 
    prop: 'navPerUnit', 
    label: '單位淨值', 
    width: '100',
    formatter: (row, column, cellValue) => {
      return cellValue.toFixed(2)
    }
  },
  { 
    label: '操作', 
    width: '150',
    slot: 'operations'
  }
]

const multipleTable = ref()

const handleEdit = (row, index) => {
  console.log('编辑:', row, index)
  alert(`编辑基金: ${row.fundName}`)
}

const handleDelete = (row, index) => {
  const confirmed = confirm(`确定要删除 ${row.fundName} 吗？`)
  if (confirmed) {
    tableData.value.splice(index, 1)
    alert('删除成功!')
  }
}

const getStatusClass = (status) => {
  const statusClasses = {
    active: 'bg-green-100 text-green-800',
    suspended: 'bg-yellow-100 text-yellow-800',
    closed: 'bg-red-100 text-red-800'
  }
  return statusClasses[status] || 'bg-gray-100 text-gray-800'
}

const getStatusText = (status) => {
  const statusTexts = {
    active: '活躍',
    suspended: '暫停',
    closed: '關閉'
  }
  return statusTexts[status] || '未知'
}
</script> 