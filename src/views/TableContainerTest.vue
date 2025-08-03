<template>
  <div class="p-8">
    <TableContainer
        :data="tableData"
        :columns="tableColumns"
        :scroll-height="300"
        :stripe="true"
        class="grid-table"
      />
  </div>
</template>
<script setup>
import { ref } from 'vue'
import TableContainer from '@/components/TableContainer.vue'

// B09_05_TableContainer
const tableColumns = ref([
  {
    prop: 'fundCode',
    label: '基金編號',
    fixed: false,
    textAlign: 'right',
    type: 'text',
    order: 1
  },
  {
    prop: 'fundName',
    label: '基金名稱',
    fixed: false,
    textAlign: 'left',
    type: 'text',
    order: 1
  },
  {
    prop: 'fundStatus',
    label: '基金狀態',
    fixed: false,
    textAlign: 'left',
    type: 'tag',
    order: 3
  },
  {
    prop: 'accountDate',
    label: '入帳日期',
    fixed: false,
    textAlign: 'left',
    type: 'tag',
    order: 5
  },
  {
    prop: 'accountAmount',
    label: '入帳金額',
    fixed: false,
    textAlign: 'left',
    type: 'tag',
    order: 6
  },
  {
    prop: 'benchmarkDate',
    label: '基準日',
    fixed: false,
    textAlign: 'left',
    type: 'tag',
    order: 5
  },
  {
    prop: 'inventoryUnits',
    label: '庫存單位數',
    fixed: false,
    textAlign: 'left',
    type: 'tag',
    order: 6
  }
])

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
  }
])
</script>
<style lang="scss" scoped>

</style>