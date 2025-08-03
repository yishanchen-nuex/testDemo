<!-- <template>
  <div class="table-container" ref="tableContainerRef">
    <div class="grid-table">
      <div class="grid-container grid-header" :style="gridStyle">
        <div class="grid-header-row">
          <div
            v-for="(col, colIndex) in columns"
            class="grid-header-col md:body-b-web-tc text-[var(--content-general-primary)]"
            :class="['text-col-' + colIndex, { calculating: isResizing }]"
            :key="col.key || `header-${colIndex}`"
            :style="{ 'text-align': col.align || 'left' }"
          >
            <div class="text-col-content">
              <div>
                {{ col.label || '' }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="grid-container grid-body" :style="gridStyle">
        <div class="grid-row" v-for="(row, rowIndex) in data" :key="rowIndex">
          <div
            class="grid-col"
            :class="['text-col-' + colIndex, { calculating: isResizing }]"
            v-for="(col, colIndex) in columns"
            :key="col.key || `col-${rowIndex}-${colIndex}`"
            :style="{ 'text-align': col.align || 'left' }"
          >
            <div class="text-col-content">
              <div v-if="col.type === TableColumnType.TEXT && col.key">{{ row[col.key] }}</div>
              <div v-if="col.type === TableColumnType.STATUS && col.key">
                <div class="flex gap-1">
                  <Tag :state="TagState.PRIMARY" v-for="k in row[col.key]">{{ k }}</Tag>
                </div>
              </div>
              <div v-if="col.type === TableColumnType.DATE && col.key">{{ row[col.key] }}</div>
              <div v-if="col.type === TableColumnType.CURRENCY && col.key">{{ row[col.key] }}</div>
              <div v-if="col.type === TableColumnType.REWARD && col.key">{{ row[col.key] }}</div>
              <div v-if="col.type === TableColumnType.TRANSACTION_PENDING && col.key">
                {{ row[col.key] }}
              </div>
              <div v-if="col.type === TableColumnType.TRANSACTION && col.key">
                {{ row[col.key] }}
              </div>
              <div v-if="col.type === TableColumnType.CTA_BUTTON">
                <slot :name="`cta-${colIndex}`" :row="row" :colIndex="colIndex">
                  <ButtonCapsule :type="ButtonCapsuleType.BlockBlue">取消出金</ButtonCapsule>
                </slot>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, onMounted, onUnmounted, nextTick } from 'vue'
import { TableColumnType } from '@/enum/table.enum'
import { ButtonCapsuleType } from '@/enum/ui.enum'
import ButtonCapsule from '@/components/ButtonCapsule.vue'
import Tag from '@/components/Tag.vue'
import { TagState } from '@/enum/tagState.enum'

interface Column {
  key?: string
  label?: string
  width?: string // e.g. '150px' or '1fr'
  minWidth?: string
  align: 'left' | 'center' | 'right'
  type?: TableColumnType // 欄位類型
}

interface Props {
  columns: Column[]
  data: Record<string, any>[]
}

const props = defineProps<Props>()
const tableContainerRef = ref<HTMLDivElement | null>(null)

const maxColWidths = ref<number[]>([])
const isResizing = ref(false)
let resizeObserver: ResizeObserver | null = null
let resizeTimeout: number | null = null
let lastContainerWidth = 0

const resetColWidths = () => {
  // 重置列宽为空数组，让 gridStyle 使用 max-content
  maxColWidths.value = []
  isResizing.value = true
}

const updateColWidths = async () => {
  // 檢查容器是否存在
  if (!tableContainerRef.value) {
    console.log('容器不存在，跳過計算')
    isResizing.value = false
    return
  }

  const currentContainerWidth = tableContainerRef.value.clientWidth

  // 如果容器寬度沒有變化且不是初次計算，直接返回
  if (currentContainerWidth === lastContainerWidth && maxColWidths.value.length > 0) {
    console.log('容器寬度無變化，跳過計算:', currentContainerWidth)
    isResizing.value = false
    return
  }

  // 更新記錄的容器寬度
  lastContainerWidth = currentContainerWidth

  console.log('開始重新計算列寬，容器寬度:', currentContainerWidth)

  // 確保 DOM 更新完成，讓 opacity 變化生效
  await nextTick()

  const colCount = props.columns.length
  const widths: number[] = []

  for (let i = 0; i < colCount; i++) {
    // 獲取所有該列的元素（包含 header 和 body）
    const els = Array.from(document.getElementsByClassName('text-col-' + i)) as HTMLElement[]

    let maxWidth = 0
    // 找出該列所有元素中最大的 clientWidth
    els.forEach((el, index) => {
      const width = el.clientWidth
      maxWidth = Math.max(maxWidth, width)
    })

    // 儲存該列的最大寬度，但最大不超過 200px
    const finalWidth = Math.min(maxWidth, 200)
    widths[i] = finalWidth
  }

  const containerWidth = currentContainerWidth
  const padding = 40 // 左右 padding: 20px * 2
  const availableWidth = containerWidth - padding

  // 計算列間距總寬度 (colCount - 1) * 40px
  const gapTotalWidth = (colCount - 1) * 40
  const remainingWidth = availableWidth - gapTotalWidth

  // 計算所有列的總寬度
  const totalColWidth = widths.reduce((sum, width) => sum + width, 0)

  console.log('容器寬度:', containerWidth)
  console.log('可用寬度:', availableWidth)
  console.log('列總寬度:', totalColWidth)
  console.log('剩餘寬度:', remainingWidth - totalColWidth)

  // 如果列寬度總和小於剩餘可用寬度，則將可用寬度均分給所有列
  if (totalColWidth < remainingWidth) {
    // 計算每列的平均寬度
    const averageWidth = Math.floor(remainingWidth / colCount)

    // 將所有列設為相同寬度（均分）
    const finalWidths = new Array(colCount).fill(averageWidth)

    maxColWidths.value = finalWidths
  } else {
    maxColWidths.value = widths
  }

  // 完成計算後重置標記
  isResizing.value = false
}

onMounted(() => {
  // 延遲執行確保 DOM 完全渲染
  setTimeout(() => {
    isResizing.value = false
    // 初始化容器寬度記錄
    if (tableContainerRef.value) {
      lastContainerWidth = tableContainerRef.value.clientWidth
    }
    updateColWidths()

    // 設置 ResizeObserver 監聽容器寬度變化
    if (tableContainerRef.value) {
      resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const newWidth = entry.contentRect.width
          console.log('容器寬度變化:', newWidth)

          // 檢查寬度是否真的有變化
          if (newWidth === lastContainerWidth) {
            console.log('寬度無實際變化，跳過處理')
            return
          }

          // 使用防抖機制避免頻繁重新計算
          if (resizeTimeout) {
            clearTimeout(resizeTimeout)
          }

          // 先重置列寬回到內容寬度
          resetColWidths()

          resizeTimeout = setTimeout(async () => {
            // 確保 DOM 完全更新後重新計算列寬
            await nextTick()
            await nextTick() // 雙重確保
            updateColWidths()
          }, 100) // 減少延遲時間，因為有 nextTick 保證
        }
      })

      resizeObserver.observe(tableContainerRef.value)
    }
  }, 100)
})

onUnmounted(() => {
  // 清理 ResizeObserver
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }

  // 清理防抖計時器
  if (resizeTimeout) {
    clearTimeout(resizeTimeout)
    resizeTimeout = null
  }

  // 重置容器寬度記錄
  lastContainerWidth = 0
})

const gridStyle = computed(() => {
  // 如果正在重置或沒有計算出的寬度，使用 max-content 讓列寬回到內容自然寬度
  const cols =
    !isResizing.value && maxColWidths.value.length > 0
      ? maxColWidths.value.map((width) => width + 'px')
      : props.columns.map(() => 'max-content')

  console.log('gridTemplateColumns:', cols.join(' '))
  console.log('isResizing:', isResizing.value)
  return {
    gridTemplateColumns: cols.join(' ')
  }
})
</script>

<style scoped>
.table-container {
  overflow: auto;
  max-height: 80vh;
  min-height: 300px;
  position: relative;
  border-radius: 0.125rem;
}

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
.grid-container .grid-header-row {
  display: contents;
}
.grid-container.grid-body .grid-row {
  display: contents;
}

.grid-container .grid-col {
  position: relative;
  background-color: #fff;
  min-height: 44px;
  display: flex;
  align-items: center;
}

.grid-container .grid-col::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: calc(-1 * var(--col-gap) / 2);
  width: calc(100% + var(--col-gap));
  border-bottom: 1px solid #ddd;
  pointer-events: none;
}

/* 4. 第一欄：不向左延伸，只向右延伸半 gap */
.grid-container .grid-col:first-child::after {
  left: 0;
  width: calc(100% + var(--col-gap) / 2);
}

/* 5. 最後一欄：只向左延伸半 gap，不向右延伸 */
.grid-container .grid-col:last-child::after {
  left: calc(-1 * var(--col-gap) / 2);
  width: calc(100% + var(--col-gap) / 2);
}

/* 6. 最後一列不畫線 */
.grid-container .grid-row:last-child .grid-col::after {
  content: none;
}

.grid-container.grid-header {
  padding: 6px 20px;
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: var(--container-container-light-active);
}

/* 确保表头固定 */
.grid-container.grid-header .grid-header-col {
  min-height: 44px;
  padding: 4px 0px;
  display: flex;
  align-items: center;
  background-color: var(--container-container-light-active);
  opacity: 1;
  transition: opacity 0.2s ease-in-out;
}

.grid-container.grid-header .grid-header-col.calculating {
  opacity: 0;
}

.grid-container.grid-body {
  padding: 6px 20px;
  background-color: #fff;
}

.grid-container.grid-body .grid-col {
  min-height: 44px;
  padding: 4px 0px;
  display: flex;
  align-items: center;
  width: auto;
  opacity: 1;
  transition: opacity 0.2s ease-in-out;
}

.grid-container.grid-body .grid-col.calculating {
  opacity: 0;
}

/* 7. 若仍有微小溢出，裁切在 tbody padding 內 */
.grid-container.grid-body {
  overflow-x: hidden; /* 水平裁切 */
}

/* 文字太長自動折行 */
[class^='text-col'] {
  word-break: break-all;
  white-space: normal;
}

.text-col-content {
  width: 100%;
}

  /* 自定义滚动条样式 */
.table-container::-webkit-scrollbar,
.grid-body::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.table-container::-webkit-scrollbar-track,
.grid-body::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 4px;
}

.table-container::-webkit-scrollbar-thumb,
.grid-body::-webkit-scrollbar-thumb {
  background: #e2e2e2;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.table-container::-webkit-scrollbar-thumb:hover,
.grid-body::-webkit-scrollbar-thumb:hover {
  background: #e2e2e2;
}

/* 去掉滚动条的箭头按钮 */
.table-container::-webkit-scrollbar-button,
.grid-body::-webkit-scrollbar-button {
  background: transparent;
}

/* 去掉滚动条的角落 */
.table-container::-webkit-scrollbar-corner,
.grid-body::-webkit-scrollbar-corner {
  background: transparent;
}
</style> -->
