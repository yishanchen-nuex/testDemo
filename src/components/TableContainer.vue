<template>
  <div class="table-container" ref="tableContainer">
    <!-- 固定表頭 -->
    <div class="table-header bg-blue-200" @scroll="onHeaderScroll">
      <table class="header-table" :style="{ width: totalTableWidth + 'px', minWidth: totalTableWidth + 'px' }">
        <thead>
          <tr>
            <th
              v-for="(column, index) in adaptiveColumns"
              :key="index"
              class="header-cell bg-blue-200"
              :style="{
                width: column.computedWidth + 'px',
                minWidth: column.computedWidth + 'px',
                maxWidth: column.computedWidth + 'px',
                textAlign: column.headerAlign || column.textAlign || 'left'
              }"
            >
              {{ column.label }}
            </th>
          </tr>
        </thead>
      </table>
    </div>

    <!-- 可滚动的表格内容 -->
    <div class="table-body" :style="{ height: scrollHeight + 'px' }" @scroll="onScroll">
      <table class="content-table" :style="{ width: totalTableWidth + 'px', minWidth: totalTableWidth + 'px' }">
        <tbody>
          <tr
            v-for="(row, rowIndex) in data"
            :key="rowIndex"
            class="table-row"
            :class="{
              'table-row-stripe': stripe && rowIndex % 2 === 1
            }"
          >
            <td
              v-for="(column, colIndex) in adaptiveColumns"
              :key="`${rowIndex}-${colIndex}`"
              class="table-cell"
              :class="{
                'table-cell-wrap': shouldWrapText
              }"
              :style="{
                width: column.computedWidth + 'px',
                minWidth: column.computedWidth + 'px',
                maxWidth: column.computedWidth + 'px',
                textAlign: column.textAlign || 'left'
              }"
            >
              <slot :name="column.prop" :row="row" :column="column" :index="rowIndex">
                {{ row[column.prop] }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted, nextTick } from 'vue'
import type { PropType } from 'vue'

interface Column {
  label: string
  prop: string
  fixed?: boolean
  textAlign?: string
  headerAlign?: string
  type?: string
  order?: number
  computedWidth?: number
}

interface TableRow {
  [key: string]: any
}

const props = defineProps({
  data: {
    type: Array as PropType<TableRow[]>,
    default: () => []
  },
  columns: {
    type: Array as PropType<Column[]>,
    default: () => []
  },
  scrollHeight: {
    type: Number,
    default: 300
  },
  stripe: {
    type: Boolean,
    default: false
  },
  adaptive: {
    type: Boolean,
    default: true
  },
  tableWidth: {
    type: Number,
    default: 800
  }
})

const emit = defineEmits(['scroll'])

const tableContainer = ref<HTMLElement>()

// 计算文本宽度的工具函数
const getTextWidth = (text: string, fontSize = '14px', fontFamily = 'Arial') => {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  if (context) {
    context.font = `${fontSize} ${fontFamily}`
    return context.measureText(text).width
  }
  return text.length * 8 // 备用计算方式
}

// 计算每列内容的实际宽度（第二順位邏輯的基础）
const calculateColumnContentWidth = (column: Column): number => {
  let maxWidth = 0

  // 计算表头宽度
  const headerWidth = getTextWidth(column.label, '14px') + 32 // 加上padding
  maxWidth = Math.max(maxWidth, headerWidth)

  // 计算数据内容宽度
  props.data.forEach((row) => {
    const cellValue = String(row[column.prop] || '')
    const cellWidth = getTextWidth(cellValue, '14px') + 32 // 加上padding
    maxWidth = Math.max(maxWidth, cellWidth)
  })

  // 设置最小宽度80px和最大宽度200px（第二順位邏輯）
  const minWidth = 80
  const maxWidthLimit = 200

  return Math.min(Math.max(maxWidth, minWidth), maxWidthLimit)
}

// 获取表格容器宽度
const getTableWidth = (): number => {
  return tableContainer.value?.clientWidth || props.tableWidth
}

// 计算自适应列配置
const adaptiveColumns = computed(() => {
  const columns = JSON.parse(JSON.stringify(props.columns))
  const tableWidth = getTableWidth()

  // 第一步：应用第二順位邏輯 - 计算每列的内容宽度（同欄同寬，看內容寬度）
  columns.forEach((col: Column) => {
    col.computedWidth = calculateColumnContentWidth(col)
  })

  // 第二步：计算总宽度
  const totalContentWidth = columns.reduce(
    (sum: number, col: Column) => sum + col.computedWidth!,
    0
  )

  // 第三步：根据总宽度应用优先级逻辑
  if (totalContentWidth < tableWidth) {
    // 第一順位邏輯：欄位少時，欄位需要剛好展滿整個table
    const extraWidth = tableWidth - totalContentWidth
    const avgExtra = extraWidth / columns.length

    // 先尝试平均分配额外宽度
    columns.forEach((col: Column) => {
      const maxWidthLimit = 200 // 保持最大宽度限制
      const canAdd = Math.min(avgExtra, maxWidthLimit - col.computedWidth!)
      col.computedWidth = col.computedWidth! + canAdd
    })

    // 如果还有剩余宽度（因为某些列达到最大宽度限制），分配给未达到最大宽度的列
    let remainingWidth =
      tableWidth - columns.reduce((sum: number, col: Column) => sum + col.computedWidth!, 0)

    while (remainingWidth > 1) {
      const columnsCanExpand = columns.filter((col: Column) => col.computedWidth! < 200)
      if (columnsCanExpand.length === 0) break

      const avgRemaining = remainingWidth / columnsCanExpand.length
      let distributed = 0

      columnsCanExpand.forEach((col: Column) => {
        const canAdd = Math.min(avgRemaining, 200 - col.computedWidth!)
        col.computedWidth = col.computedWidth! + canAdd
        distributed += canAdd
      })

      remainingWidth -= distributed
      if (distributed === 0) break // 防止无限循环
    }
  } else {
    // 第三順位邏輯：欄位多時需左右滑動，但欄位寬度仍依據第二順位邏輯（同欄同寬，看內容寬度）
    // 保持原计算的内容宽度，不进行扩展，让表格出现横向滚动
    // 这里不需要额外处理，已经在第一步中应用了第二順位邏輯
  }

  return columns
})

// 判断是否需要横向滚动
const needHorizontalScroll = computed(() => {
  const totalWidth = adaptiveColumns.value.reduce(
    (sum: number, col: Column) => sum + col.computedWidth!,
    0
  )
  return totalWidth > getTableWidth()
})

// 判断是否需要文本换行
const shouldWrapText = computed(() => {
  // 如果需要横向滚动，文字不换行以保持列宽计算的准确性
  return !needHorizontalScroll.value
})

// 计算表格总宽度
const totalTableWidth = computed(() => {
  return adaptiveColumns.value.reduce(
    (sum: number, col: Column) => sum + col.computedWidth!,
    0
  )
})

// 滚动事件处理
const onScroll = (event: Event) => {
  const target = event.target as HTMLElement

  // 同步表头的横向滚动
  const header = target.parentElement?.parentElement?.querySelector('.table-header')
  if (header) {
    header.scrollLeft = target.scrollLeft
  }

  emit('scroll', event)
}

// 表头滚动事件处理
const onHeaderScroll = (event: Event) => {
  const target = event.target as HTMLElement

  // 同步内容的横向滚动
  const body = target.parentElement?.querySelector('.table-body')
  if (body) {
    body.scrollLeft = target.scrollLeft
  }
}

// 监听窗口大小变化，重新计算列宽
onMounted(() => {
  nextTick(() => {
    // 初始化后重新计算一次
    const tableWidth = getTableWidth()
    console.log('Table width:', tableWidth)
  })
})
</script>

<style scoped>
.table-container {
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
}

.table-header {
  position: sticky;
  top: 0;
  z-index: 10;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 6px 20px;
}

.table-header::-webkit-scrollbar {
  display: none;
}

.header-table {
  border-collapse: collapse;
  table-layout: fixed;
}

.header-cell {
  /* color: var(--surface-surface-primary-dark-mode); */
  position: sticky;
  top: 0;
  /* min-height: 52px; */
  /* display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 8px 20px;
  white-space: normal;
  word-wrap: break-word;
  word-break: break-all;
  line-height: 1.4;
  border: none;
  background: var(--container-container-light-active); */
}

.table-body {
  overflow: auto;
  position: relative;
}

.content-table {
  border-collapse: collapse;
  table-layout: fixed;
  background-color: #ffffff;
}

.table-row {
  border-bottom: 1px solid #eee;
}

.table-row:last-child {
  border-bottom: none;
}

.table-row-stripe {
  background-color: #f9f9f9;
}

.table-cell {
  box-sizing: border-box;
  color: #606266;
  height: 52px;
  padding: 4px 20px;
  border: none;
  vertical-align: middle;
  /* 默认不换行 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 当需要换行时 */
.table-cell-wrap {
  white-space: normal;
  word-wrap: break-word;
  word-break: break-all;
  vertical-align: middle; /* 保持垂直居中 */
}

/* 滚动条样式 */
.table-body::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.table-body::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.table-body::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.table-body::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.table-body::-webkit-scrollbar-corner {
  background: #f1f1f1;
}

/* 响应式处理 */
@media (max-width: 768px) {
  .header-cell,
  .table-cell {
    padding: 8px 6px;
    font-size: 14px;
  }
}
</style>
  