<template>
  <div 
    ref="tableRef"
    class="el-table" 
    :class="tableClasses"
    :style="tableStyle"
  >
    <!-- 表格头部 - 固定头部 -->
    <div 
      v-if="showHeader" 
      ref="headerWrapperRef"
      class="el-table__header-wrapper"
      :style="headerWrapperStyle"
    >
      <table 
        ref="headerTableRef"
        class="el-table__header" 
        :style="{ width: tableContentWidth }"
      >
        <colgroup>
          <col
            v-for="(column, index) in props.columns"
            :key="index"
            :width="getColumnWidth(column)"
            :style="getColumnStyle(column)"
          />
        </colgroup>
        <thead>
          <tr class="el-table__row">
            <th
              v-for="(column, index) in props.columns"
              :key="index"
              class="el-table__cell"
              :class="getHeaderCellClass(column)"
              :style="getHeaderCellStyle(column)"
            >
              <div class="cell">
                <span v-if="column.type === 'selection'">
                  <input
                    type="checkbox"
                    :checked="isAllSelected"
                    :indeterminate="isIndeterminate"
                    @change="toggleSelectAll"
                    class="el-checkbox__input"
                  />
                </span>
                <span v-else-if="column.type === 'index'">#</span>
                <span v-else>{{ column.label }}</span>
                <span
                  v-if="column.sortable"
                  class="caret-wrapper"
                  @click="handleSort(column)"
                >
                  <i class="sort-caret ascending" :class="{ active: currentSort.prop === column.prop && currentSort.order === 'ascending' }"></i>
                  <i class="sort-caret descending" :class="{ active: currentSort.prop === column.prop && currentSort.order === 'descending' }"></i>
                </span>
              </div>
            </th>
          </tr>
        </thead>
      </table>
    </div>

    <!-- 表格主体 - 可滚动区域 -->
    <div 
      ref="bodyWrapperRef"
      class="el-table__body-wrapper"
      :style="bodyWrapperStyle"
      @scroll="handleBodyScroll"
    >
      <table 
        ref="bodyTableRef"
        class="el-table__body" 
        :style="{ width: tableContentWidth }"
      >
        <colgroup>
          <col
            v-for="(column, index) in props.columns"
            :key="index"
            :width="getColumnWidth(column)"
            :style="getColumnStyle(column)"
          />
        </colgroup>
        <tbody>
          <tr
            v-for="(row, rowIndex) in sortedData"
            :key="getRowKey(row, rowIndex)"
            class="el-table__row"
            :class="getRowClass(row, rowIndex)"
            @click="handleRowClick(row, rowIndex)"
            @dblclick="handleRowDblClick(row, rowIndex)"
          >
            <td
              v-for="(column, colIndex) in props.columns"
              :key="colIndex"
              class="el-table__cell"
              :class="getCellClass(row, column, rowIndex, colIndex)"
              :style="getCellStyle(row, column, rowIndex, colIndex)"
            >
              <div class="cell">
                <!-- 选择框列 -->
                <span v-if="column.type === 'selection'">
                  <input
                    type="checkbox"
                    :checked="isRowSelected(row)"
                    @change="toggleRowSelection(row)"
                    class="el-checkbox__input"
                  />
                </span>
                <!-- 索引列 -->
                <span v-else-if="column.type === 'index'">
                  {{ rowIndex + 1 }}
                </span>
                <!-- 展开列 -->
                <span v-else-if="column.type === 'expand'">
                  <i
                    class="el-table__expand-icon"
                    :class="{ 'el-table__expand-icon--expanded': expandedRows.includes(getRowKey(row, rowIndex)) }"
                    @click="toggleRowExpansion(row, rowIndex)"
                  >
                    ▶
                  </i>
                </span>
                <!-- 自定义内容 -->
                <span v-else-if="column.slot">
                  <slot :name="column.slot" :row="row" :column="column" :$index="rowIndex"></slot>
                </span>
                <!-- 格式化内容 -->
                <span v-else-if="column.formatter">
                  {{ column.formatter(row, column, getCellValue(row, column.prop), rowIndex) }}
                </span>
                <!-- 普通内容 -->
                <span v-else>
                  {{ getCellValue(row, column.prop) }}
                </span>
              </div>
            </td>
          </tr>
          <!-- 展开行内容 -->
          <template v-for="(expandRow, expandIndex) in sortedData" :key="'expand-check-' + getRowKey(expandRow, expandIndex)">
            <tr
              v-if="expandedRows.includes(getRowKey(expandRow, expandIndex))"
              :key="'expand-' + getRowKey(expandRow, expandIndex)"
              class="el-table__expanded-row"
            >
              <td :colspan="props.columns.length" class="el-table__cell">
                <slot name="expand" :row="expandRow" :$index="expandIndex"></slot>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- 空数据提示 -->
    <div v-if="!props.data || props.data.length === 0" class="el-table__empty-block">
      <span class="el-table__empty-text">
        <slot name="empty">{{ props.emptyText }}</slot>
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'

// Props - 仿照 Element Plus Table 的 API
const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  columns: {
    type: Array,
    default: () => []
  },
  height: {
    type: [String, Number],
    default: ''
  },
  maxHeight: {
    type: [String, Number],
    default: ''
  },
  stripe: {
    type: Boolean,
    default: false
  },
  border: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['large', 'default', 'small'].includes(value)
  },
  fit: {
    type: Boolean,
    default: true
  },
  showHeader: {
    type: Boolean,
    default: true
  },
  highlightCurrentRow: {
    type: Boolean,
    default: false
  },
  currentRowKey: {
    type: [String, Number],
    default: null
  },
  rowClassName: {
    type: [String, Function],
    default: ''
  },
  rowStyle: {
    type: [Object, Function],
    default: () => ({})
  },
  cellClassName: {
    type: [String, Function],
    default: ''
  },
  cellStyle: {
    type: [Object, Function],
    default: () => ({})
  },
  headerRowClassName: {
    type: [String, Function],
    default: ''
  },
  headerRowStyle: {
    type: [Object, Function],
    default: () => ({})
  },
  headerCellClassName: {
    type: [String, Function],
    default: ''
  },
  headerCellStyle: {
    type: [Object, Function],
    default: () => ({})
  },
  rowKey: {
    type: [String, Function],
    default: ''
  },
  emptyText: {
    type: String,
    default: '暂无数据'
  },
  defaultExpandAll: {
    type: Boolean,
    default: false
  },
  expandRowKeys: {
    type: Array,
    default: () => []
  },
  defaultSort: {
    type: Object,
    default: () => ({})
  },
  tooltipEffect: {
    type: String,
    default: 'dark'
  },
  showSummary: {
    type: Boolean,
    default: false
  },
  sumText: {
    type: String,
    default: '合计'
  },
  summaryMethod: {
    type: Function,
    default: null
  },
  spanMethod: {
    type: Function,
    default: null
  },
  selectOnIndeterminate: {
    type: Boolean,
    default: true
  },
  indent: {
    type: Number,
    default: 16
  },
  lazy: {
    type: Boolean,
    default: false
  },
  load: {
    type: Function,
    default: null
  },
  treeProps: {
    type: Object,
    default: () => ({
      hasChildren: 'hasChildren',
      children: 'children'
    })
  },
  fixedHeader: {
    type: Boolean,
    default: false
  },
  scrollHeight: {
    type: [String, Number],
    default: ''
  }
})

// Emits - 仿照 Element Plus Table 的事件
const emit = defineEmits([
  'select',
  'select-all',
  'selection-change',
  'cell-mouse-enter',
  'cell-mouse-leave',
  'cell-click',
  'cell-dblclick',
  'row-click',
  'row-contextmenu',
  'row-dblclick',
  'header-click',
  'header-contextmenu',
  'sort-change',
  'filter-change',
  'current-change',
  'header-dragend',
  'expand-change'
])

// Refs
const tableRef = ref(null)
const headerWrapperRef = ref(null)
const bodyWrapperRef = ref(null)
const headerTableRef = ref(null)
const bodyTableRef = ref(null)

// 响应式数据
const selectedRows = ref([])
const expandedRows = ref([])
const currentSort = ref({ prop: null, order: null })
const scrollLeft = ref(0)
const scrollTop = ref(0)

// 计算属性
const tableStyle = computed(() => {
  const style = {}
  
  if (props.height) {
    style.height = typeof props.height === 'number' ? `${props.height}px` : props.height
  } else if (props.scrollHeight) {
    style.height = typeof props.scrollHeight === 'number' ? `${props.scrollHeight}px` : props.scrollHeight
  }
  
  return style
})

const headerWrapperStyle = computed(() => {
  const style = {
    position: props.fixedHeader || props.scrollHeight ? 'sticky' : 'relative',
    top: props.fixedHeader || props.scrollHeight ? '0' : 'auto',
    zIndex: props.fixedHeader || props.scrollHeight ? '10' : 'auto',
    overflow: 'hidden',
    backgroundColor: '#fff'
  }
  
  return style
})

const bodyWrapperStyle = computed(() => {
  const style = {}
  
  if (props.scrollHeight) {
    const headerHeight = props.showHeader ? 40 : 0 // 估算表头高度
    const maxBodyHeight = (typeof props.scrollHeight === 'number' ? props.scrollHeight : parseInt(props.scrollHeight)) - headerHeight
    style.maxHeight = `${maxBodyHeight}px`
    style.overflowY = 'auto'
  }
  
  style.overflowX = 'auto'
  
  return style
})

const tableContentWidth = computed(() => {
  // 计算表格内容总宽度
  const totalWidth = props.columns.reduce((width, col) => {
    const colWidth = getColumnWidth(col)
    return width + (parseInt(colWidth) || 120)
  }, 0)
  
  return `${totalWidth}px`
})

const tableClasses = computed(() => {
  return {
    'el-table--fit': props.fit,
    'el-table--striped': props.stripe,
    'el-table--border': props.border,
    'el-table--fixed-header': props.fixedHeader || props.scrollHeight,
    'el-table--scroll-height': !!props.scrollHeight,
    [`el-table--${props.size}`]: props.size !== 'default'
  }
})

const isAllSelected = computed(() => {
  if (!props.data || !Array.isArray(props.data) || props.data.length === 0) return false
  return selectedRows.value.length === props.data.length
})

const isIndeterminate = computed(() => {
  if (!props.data || !Array.isArray(props.data)) return false
  return selectedRows.value.length > 0 && selectedRows.value.length < props.data.length
})

const sortedData = computed(() => {
  if (!props.data || !Array.isArray(props.data)) {
    return []
  }
  
  if (!currentSort.value.prop || !currentSort.value.order) {
    return props.data
  }

  const { prop, order } = currentSort.value
  const column = props.columns.find(col => col.prop === prop)
  
  return [...props.data].sort((a, b) => {
    let aVal = getCellValue(a, prop)
    let bVal = getCellValue(b, prop)
    
    if (column && column.sortMethod) {
      return column.sortMethod(a, b)
    }
    
    if (typeof aVal === 'string') aVal = aVal.toLowerCase()
    if (typeof bVal === 'string') bVal = bVal.toLowerCase()
    
    if (aVal < bVal) return order === 'ascending' ? -1 : 1
    if (aVal > bVal) return order === 'ascending' ? 1 : -1
    return 0
  })
})

// 方法
const getColumnWidth = (column) => {
  if (column.width) {
    return typeof column.width === 'number' ? `${column.width}px` : column.width
  }
  return `${column.minWidth || 120}px`
}

const getColumnStyle = (column) => {
  const style = {}
  if (column.minWidth) {
    style.minWidth = `${column.minWidth}px`
  }
  if (column.maxWidth) {
    style.maxWidth = `${column.maxWidth}px`
  }
  return style
}

// 处理表体滚动 - 同步表头滚动
const handleBodyScroll = (event) => {
  const { scrollLeft: newScrollLeft, scrollTop: newScrollTop } = event.target
  
  // 同步表头的横向滚动
  if (headerWrapperRef.value && newScrollLeft !== scrollLeft.value) {
    headerWrapperRef.value.scrollLeft = newScrollLeft
    scrollLeft.value = newScrollLeft
  }
  
  scrollTop.value = newScrollTop
}

const getCellValue = (row, prop) => {
  if (!prop || !row) return ''
  try {
    return prop.split('.').reduce((obj, key) => obj?.[key], row) || ''
  } catch (error) {
    return ''
  }
}

const getRowKey = (row, index) => {
  if (typeof props.rowKey === 'function') {
    return props.rowKey(row)
  }
  if (typeof props.rowKey === 'string' && props.rowKey !== '') {
    return row[props.rowKey]
  }
  return index
}

const getRowClass = (row, index) => {
  const classes = []
  
  if (props.stripe && index % 2 === 1) {
    classes.push('el-table__row--striped')
  }
  
  if (typeof props.rowClassName === 'function') {
    const result = props.rowClassName({ row, rowIndex: index })
    if (result) classes.push(result)
  } else if (props.rowClassName) {
    classes.push(props.rowClassName)
  }
  
  return classes.join(' ')
}

const getCellClass = (row, column, rowIndex, colIndex) => {
  const classes = []
  
  if (typeof props.cellClassName === 'function') {
    const result = props.cellClassName({ row, column, rowIndex, columnIndex: colIndex })
    if (result) classes.push(result)
  } else if (props.cellClassName) {
    classes.push(props.cellClassName)
  }
  
  return classes.join(' ')
}

const getCellStyle = (row, column, rowIndex, colIndex) => {
  if (typeof props.cellStyle === 'function') {
    return props.cellStyle({ row, column, rowIndex, columnIndex: colIndex })
  }
  return props.cellStyle
}

const getHeaderCellClass = (column) => {
  const classes = []
  
  if (typeof props.headerCellClassName === 'function') {
    const result = props.headerCellClassName({ column, columnIndex: props.columns.indexOf(column) })
    if (result) classes.push(result)
  } else if (props.headerCellClassName) {
    classes.push(props.headerCellClassName)
  }
  
  return classes.join(' ')
}

const getHeaderCellStyle = (column) => {
  if (typeof props.headerCellStyle === 'function') {
    return props.headerCellStyle({ column, columnIndex: props.columns.indexOf(column) })
  }
  return props.headerCellStyle
}

const isRowSelected = (row) => {
  const key = getRowKey(row, props.data.indexOf(row))
  return selectedRows.value.some(selectedRow => getRowKey(selectedRow, 0) === key)
}

const toggleRowSelection = (row, selected) => {
  const key = getRowKey(row, props.data.indexOf(row))
  const index = selectedRows.value.findIndex(selectedRow => getRowKey(selectedRow, 0) === key)
  
  if (selected === undefined) {
    selected = index === -1
  }
  
  if (selected && index === -1) {
    selectedRows.value.push(row)
  } else if (!selected && index !== -1) {
    selectedRows.value.splice(index, 1)
  }
  
  emit('select', selectedRows.value, row)
  emit('selection-change', selectedRows.value)
}

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedRows.value = []
  } else {
    selectedRows.value = [...props.data]
  }
  
  emit('select-all', selectedRows.value)
  emit('selection-change', selectedRows.value)
}

const toggleRowExpansion = (row, index) => {
  const key = getRowKey(row, index)
  const expandIndex = expandedRows.value.indexOf(key)
  
  if (expandIndex === -1) {
    expandedRows.value.push(key)
  } else {
    expandedRows.value.splice(expandIndex, 1)
  }
  
  emit('expand-change', row, expandedRows.value.includes(key))
}

const handleSort = (column) => {
  if (!column.sortable) return
  
  let order = 'ascending'
  if (currentSort.value.prop === column.prop) {
    if (currentSort.value.order === 'ascending') {
      order = 'descending'
    } else if (currentSort.value.order === 'descending') {
      order = null
    }
  }
  
  currentSort.value = {
    prop: order ? column.prop : null,
    order: order
  }
  
  emit('sort-change', {
    column,
    prop: column.prop,
    order
  })
}

const handleRowClick = (row, index) => {
  emit('row-click', row, index)
}

const handleRowDblClick = (row, index) => {
  emit('row-dblclick', row, index)
}

// 公开方法（通过 defineExpose）
const clearSelection = () => {
  selectedRows.value = []
  emit('selection-change', selectedRows.value)
}

const toggleAllSelection = () => {
  toggleSelectAll()
}

const toggleRowSelectionMethod = (row, selected) => {
  toggleRowSelection(row, selected)
}

const clearSort = () => {
  currentSort.value = { prop: null, order: null }
}

const clearFilter = (columnKey) => {
  // Filter functionality would be implemented here
}

const doLayout = () => {
  // Layout recalculation would be implemented here
}

const sort = (prop, order) => {
  currentSort.value = { prop, order }
}

defineExpose({
  clearSelection,
  toggleAllSelection,
  toggleRowSelection: toggleRowSelectionMethod,
  clearSort,
  clearFilter,
  doLayout,
  sort
})

// 生命周期
onMounted(() => {
  if (props.defaultSort.prop) {
    currentSort.value = {
      prop: props.defaultSort.prop,
      order: props.defaultSort.order || 'ascending'
    }
  }
  
  if (props.defaultExpandAll) {
    expandedRows.value = props.data.map((row, index) => getRowKey(row, index))
  } else if (props.expandRowKeys.length > 0) {
    expandedRows.value = [...props.expandRowKeys]
  }

  // 初始化滚动同步
  nextTick(() => {
    if (bodyWrapperRef.value && headerWrapperRef.value) {
      // 确保表头和表体的滚动同步
      const syncScroll = () => {
        if (headerWrapperRef.value) {
          headerWrapperRef.value.scrollLeft = bodyWrapperRef.value.scrollLeft
        }
      }
      
      bodyWrapperRef.value.addEventListener('scroll', syncScroll)
      
      // 清理函数
      onUnmounted(() => {
        if (bodyWrapperRef.value) {
          bodyWrapperRef.value.removeEventListener('scroll', syncScroll)
        }
      })
    }
  })
})
</script>

<style scoped>
.el-table {
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  background-color: #fff;
  font-size: 14px;
  color: #606266;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.el-table--fixed-header {
  display: flex;
  flex-direction: column;
}

.el-table--border {
  border: 1px solid #ebeef5;
}

.el-table--border th,
.el-table--border td {
  border-right: 1px solid #ebeef5;
}

.el-table__header-wrapper {
  overflow-x: auto;
  overflow-y: hidden;
  border-bottom: 1px solid #ebeef5;
}

/* 隐藏表头的滚动条 */
.el-table__header-wrapper::-webkit-scrollbar {
  display: none;
}

.el-table__header-wrapper {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.el-table__header {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.el-table__body-wrapper {
  flex: 1;
  overflow: auto;
  position: relative;
}

.el-table__body {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.el-table__row {
  background-color: #fff;
  transition: background-color 0.25s ease;
}

.el-table__row:hover {
  background-color: #f5f7fa;
}

.el-table__row--striped {
  background-color: #fafafa;
}

.el-table__row--striped:hover {
  background-color: #f5f7fa;
}

.el-table__cell {
  padding: 12px 0;
  min-width: 0;
  box-sizing: border-box;
  text-overflow: ellipsis;
  vertical-align: middle;
  position: relative;
  text-align: left;
  border-bottom: 1px solid #ebeef5;
}

.el-table__header .el-table__cell {
  background-color: #f5f7fa;
  color: #909399;
  font-weight: 500;
}

.cell {
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-break: break-all;
  line-height: 23px;
  padding-left: 10px;
  padding-right: 10px;
}

/* 滚动条样式 */
.el-table__body-wrapper::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.el-table__body-wrapper::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.el-table__body-wrapper::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.el-table__body-wrapper::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.el-table__body-wrapper::-webkit-scrollbar-corner {
  background: #f1f1f1;
}

/* 排序图标样式 */
.caret-wrapper {
  display: inline-block;
  vertical-align: middle;
  width: 24px;
  height: 14px;
  overflow: initial;
  position: relative;
  cursor: pointer;
  margin-left: 4px;
}

.sort-caret {
  width: 0;
  height: 0;
  border: solid 5px transparent;
  position: absolute;
  left: 7px;
}

.sort-caret.ascending {
  border-bottom-color: #c0c4cc;
  top: -5px;
}

.sort-caret.descending {
  border-top-color: #c0c4cc;
  bottom: -3px;
}

.sort-caret.active {
  color: #409eff;
}

.sort-caret.ascending.active {
  border-bottom-color: #409eff;
}

.sort-caret.descending.active {
  border-top-color: #409eff;
}

.el-checkbox__input {
  cursor: pointer;
}

.el-table__expand-icon {
  cursor: pointer;
  color: #666;
  font-size: 12px;
  transition: transform 0.2s ease-in-out;
  height: 20px;
  width: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.el-table__expand-icon--expanded {
  transform: rotate(90deg);
}

.el-table__expanded-row {
  background-color: #fbfbfb;
}

.el-table__expanded-row .el-table__cell {
  border-bottom: none;
}

.el-table__empty-block {
  min-height: 60px;
  text-align: center;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.el-table__empty-text {
  line-height: 60px;
  width: 50%;
  color: #909399;
}

.el-table--small .el-table__cell {
  padding: 8px 0;
}

.el-table--large .el-table__cell {
  padding: 16px 0;
}
</style> 