<template>
  <div 
    class="overflow-auto border border-gray-200 rounded-lg"
    :style="{ 
      'max-height': '80vh', 
      'min-height': '300px'
    }"
    ref="tableContainerRef"
  >  
    <table class="grid-table">
      <thead class="grid-container" :style="gridStyle" role="rowgroup">
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            role="columnheader"
            :style="{ textAlign: col.align || 'left' }"
          >
            {{ col.title }}
          </th>
        </tr>
      </thead>
      <tbody class="grid-container" :style="gridStyle" role="rowgroup">
        <tr v-for="(row, rowIndex) in data" :key="rowIndex">
          <td
            v-for="col in columns"
            :key="col.key"
            role="cell"
            :style="{ textAlign: col.align || 'left' }"
          >
            {{ row[col.key] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, onMounted, nextTick } from 'vue';

interface Column {
  key: string;
  title: string;
  width?: string;    // e.g. '150px' or '1fr'
  minWidth?: string;
  align?: 'left' | 'center' | 'right';
}

interface Props {
  columns: Column[];
  data: Record<string, any>[];
}

const props = defineProps<Props>();

const tableContainerRef = ref<HTMLDivElement | null>(null);

onMounted(() => {
  nextTick(() => {}); // 保证 tableContainerRef 可用
});

const gridStyle = computed(() => {
  // 1. 计算所有列宽度总和（只统计 px 单位）
  let totalWidth = 0;
  props.columns.forEach(col => {
    if (col.width && col.width.endsWith('px')) {
      totalWidth += parseInt(col.width, 10);
    }
  });
  // 2. 获取表格实际宽度
  const tableWidth = tableContainerRef.value?.offsetWidth || 0;
  // 3. 判断是否需要均分
  let cols;
  if (totalWidth < tableWidth) {
    // 强制全部均分
    cols = props.columns.map(() => '1fr');
  } else {
    // 严格用 width，没 width 用 auto
    cols = props.columns.map(col => col.width ?? 'auto');
  }
  return {
    gridTemplateColumns: cols.join(' ')
  };
});
</script>

<style scoped>
.grid-table {
  width: 100%;
  min-width: max-content;
  border-collapse: collapse;
}

/* grid 容器，欄寬由 gridStyle 控制 */
.grid-container {
  --col-gap: 40px; 
  display: grid;
  grid-auto-rows: auto;
  column-gap: var(--col-gap);
  row-gap: 0;
}

/* 讓 tr 內的 th/td 成為 grid 的直接子項，把 tr 隱形化 */
.grid-container tr {
  display: contents;
}

.grid-container td {
  position: relative;
  background-color: #fff;
  min-height: 44px;
  display: flex;
  align-items: center;
  /* white-space: nowrap; */
}

.grid-container td::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: calc(-1 * var(--col-gap) / 2);
  width: calc(100% + var(--col-gap));
  border-bottom: 1px solid #ddd;
  pointer-events: none;
}

/* 4. 第一欄：不向左延伸，只向右延伸半 gap */
.grid-container td:first-child::after {
  left: 0;
  width: calc(100% + var(--col-gap) / 2);
}

/* 5. 最後一欄：只向左延伸半 gap，不向右延伸 */
.grid-container td:last-child::after {
  left: calc(-1 * var(--col-gap) / 2);
  width: calc(100% + var(--col-gap) / 2);
}

/* 6. 最後一列不畫線 */
.grid-container tr:last-child td::after {
  content: none;
}


th, td {
  min-height: 44px;
  display: flex;
  align-items: center;
}

thead {
  background-color: #dceaff;
  padding: 6px 20px;
  position: sticky;
  top: 0;
  z-index: 10;
}

/* 确保表头固定 */
thead th {
  background-color: #dceaff;
}

tbody {
  padding: 6px 20px;
}

/* 7. 若仍有微小溢出，裁切在 tbody padding 內 */
tbody.grid-container {
  overflow-x: hidden;  /* 水平裁切 */
}
</style>

