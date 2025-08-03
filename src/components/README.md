# ElTable 组件使用说明

这是一个完全仿照 Element Plus Table 组件的自定义表格组件，具有相同的 API 和功能。

## 基本用法

```vue
<template>
  <ElTable :data="tableData" :columns="columns" />
</template>

<script setup>
import ElTable from './components/ElTable.vue'

const tableData = [
  { name: '张三', age: 25, address: '北京市' },
  { name: '李四', age: 30, address: '上海市' }
]

const columns = [
  { prop: 'name', label: '姓名', width: '120' },
  { prop: 'age', label: '年龄', width: '80' },
  { prop: 'address', label: '地址', minWidth: 200 }
]
</script>
```

## Props API

### 表格属性

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|-----|-----|-----|--------|-------|
| data | 显示的数据 | Array | — | [] |
| columns | 列配置 | Array | — | [] |
| height | Table 的高度 | String/Number | — | — |
| max-height | Table 的最大高度 | String/Number | — | — |
| stripe | 是否为斑马纹 table | Boolean | — | false |
| border | 是否带有纵向边框 | Boolean | — | false |
| size | Table 的尺寸 | String | large/default/small | default |
| fit | 列的宽度是否自撑开 | Boolean | — | true |
| show-header | 是否显示表头 | Boolean | — | true |
| highlight-current-row | 是否要高亮当前行 | Boolean | — | false |
| current-row-key | 当前行的 key | String/Number | — | — |
| row-class-name | 行的 className | String/Function | — | — |
| row-style | 行的 style | Object/Function | — | — |
| cell-class-name | 单元格的 className | String/Function | — | — |
| cell-style | 单元格的 style | Object/Function | — | — |
| header-row-class-name | 表头行的 className | String/Function | — | — |
| header-row-style | 表头行的 style | Object/Function | — | — |
| header-cell-class-name | 表头单元格的 className | String/Function | — | — |
| header-cell-style | 表头单元格的 style | Object/Function | — | — |
| row-key | 行数据的 Key | String/Function | — | — |
| empty-text | 空数据时显示的文本内容 | String | — | 暂无数据 |
| default-expand-all | 是否默认展开所有行 | Boolean | — | false |
| expand-row-keys | 可以通过该属性设置 Table 目前的展开行 | Array | — | [] |
| default-sort | 默认的排序列的 prop 和顺序 | Object | — | {} |

### 列配置 (columns)

每个列配置对象支持以下属性：

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|-----|-----|-----|--------|-------|
| type | 对应列的类型 | String | selection/index/expand | — |
| prop | 对应列内容的字段名 | String | — | — |
| label | 显示的标题 | String | — | — |
| width | 对应列的宽度 | String/Number | — | — |
| min-width | 对应列的最小宽度 | Number | — | — |
| fixed | 列是否固定 | String/Boolean | true/left/right | — |
| sortable | 对应列是否可以排序 | Boolean | — | false |
| sort-method | 对该列进行排序的方法 | Function | — | — |
| formatter | 用来格式化内容 | Function | — | — |
| slot | 自定义插槽名称 | String | — | — |

## 事件

| 事件名 | 说明 | 参数 |
|--------|-----|-----|
| select | 当用户手动勾选数据行的 Checkbox 时触发的事件 | selection, row |
| select-all | 当用户手动勾选全选 Checkbox 时触发的事件 | selection |
| selection-change | 当选择项发生变化时会触发该事件 | selection |
| cell-click | 当某个单元格被点击时会触发该事件 | row, column, cell, event |
| cell-dblclick | 当某个单元格被双击击时会触发该事件 | row, column, cell, event |
| row-click | 当某一行被点击时会触发该事件 | row, event, column |
| row-dblclick | 当某一行被双击时会触发该事件 | row, event |
| sort-change | 当表格的排序条件发生变化的时候会触发该事件 | { column, prop, order } |
| expand-change | 当用户对某一行展开或者关闭的时候会触发该事件 | row, expanded |

## 方法

通过 ref 可以调用以下方法：

| 方法名 | 说明 | 参数 |
|--------|-----|-----|
| clearSelection | 用于多选表格，清空用户的选择 | — |
| toggleAllSelection | 用于多选表格，切换全选和全不选 | — |
| toggleRowSelection | 用于多选表格，切换某一行的选中状态 | row, selected |
| clearSort | 用于清空排序条件 | — |
| sort | 手动对 Table 进行排序 | prop, order |

## 插槽

| 插槽名 | 说明 | 参数 |
|--------|-----|-----|
| default | 自定义列的内容 | { row, column, $index } |
| expand | 展开行的内容 | { row, $index } |
| empty | 无数据时的内容 | — |

## 使用示例

### 1. 带选择框的表格

```vue
<ElTable
  :data="tableData"
  :columns="[
    { type: 'selection', width: '55' },
    { type: 'index', label: '#', width: '50' },
    { prop: 'name', label: '姓名', width: '120' },
    { prop: 'age', label: '年龄', width: '80', sortable: true }
  ]"
  @selection-change="handleSelectionChange"
/>
```

### 2. 自定义列内容

```vue
<ElTable :data="tableData" :columns="columns">
  <template #operations="{ row, $index }">
    <button @click="edit(row)">编辑</button>
    <button @click="remove(row)">删除</button>
  </template>
</ElTable>
```

### 3. 可展开的表格

```vue
<ElTable :data="tableData" :columns="expandColumns">
  <template #expand="{ row }">
    <div>
      <p>详细信息: {{ row.detail }}</p>
    </div>
  </template>
</ElTable>
```

### 4. 格式化显示

```vue
<script setup>
const columns = [
  {
    prop: 'salary',
    label: '薪资',
    formatter: (row, column, cellValue) => {
      return `¥${cellValue.toLocaleString()}`
    }
  }
]
</script>
```

## 样式定制

组件使用了 Element Plus 的样式规范，您可以通过以下 CSS 类名进行样式定制：

- `.el-table` - 表格主容器
- `.el-table__header` - 表头
- `.el-table__body` - 表格主体
- `.el-table__row` - 表格行
- `.el-table__cell` - 表格单元格
- `.el-table--striped` - 斑马纹样式
- `.el-table--border` - 边框样式

这个组件完全兼容 Element Plus Table 的 API，您可以直接替换使用。 