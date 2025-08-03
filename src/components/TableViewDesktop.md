<template>
  <div class="rounded-lg overflow-hidden shadow-[0px_4px_16px_0px_rgba(0,68,173,0.08)]">
    <div
      class="max-h-[80vh] relative bg-white flex flex-col w-full"
      ref="tableContainerRef"
      :class="{ 'h-[auto]': isHeightAuto, 'min-h-[300px]': !isHeightAuto }"
    >
      <!-- 表格內容區域 -->
      <div
        class="table-scroll-wrapper overflow-x-auto w-full flex-1 relative"
        ref="scrollWrapperRef"
        @scroll="onHorizontalScroll"
      >
        <div class="min-w-max h-full flex flex-col relative" ref="tableInnerRef">
          <!-- 表頭 -->
          <div
            class="flex-shrink-0 relative z-[5] bg-[var(--container-container-light-active)]"
            ref="tableHeaderRef"
          >
            <div class="grid auto-rows-auto gap-x-10 gap-y-0 py-1.5 px-5" :style="gridStyle">
              <div
                v-for="(col, colIndex) in filteredColumns"
                :key="colIndex"
                class="box-border min-h-[52px] h-auto py-1 flex items-center md:body-b-web-tc text-[var(--content-general-primary)]"
                :class="[`${tableId}-cell-${colIndex}`, getResizingClass()]"
                :style="{ 'text-align': col.align || 'left' }"
              >
                <div class="w-full" v-if="col.key">
                  {{ col.label || '' }}
                </div>
              </div>
            </div>
          </div>
          <!-- 表身-->
          <div
            class="table-body flex-1 overflow-y-auto overflow-x-hidden pb-1.5"
            ref="bodyScrollRef"
            @scroll="onVerticalScroll"
            :style="{ maxHeight: 'calc(80vh - ' + headerHeight + 'px)' }"
          >
            <div
              v-for="(row, rowIndex) in data"
              :key="rowIndex"
              class="table-body-row grid auto-rows-auto gap-x-10 gap-y-0 py-1.5 px-5 bg-white relative"
              :style="gridStyle"
            >
              <div
                v-for="(col, colIndex) in filteredColumns"
                :key="rowIndex + colIndex"
                class="box-border min-h-[52px] h-auto py-1 flex items-center w-full"
                :class="[`${tableId}-cell-${colIndex}`, getResizingClass()]"
                :style="{ 'text-align': col.align || TableColumnAlign.Left }"
              >
                <div class="w-full" v-if="col.key">
                  <!-- 文字 -->
                  <div
                    v-if="col.type === TableColumnType.TEXT"
                    class="body-r-web-tc"
                    :class="{
                      'text-[var(--content-content-negative)]':
                        col.key === 'deductionStatus' && row[col.key] === false
                    }"
                  >
                    <template v-if="col.key === 'deductionStatus'">
                      {{ row[col.key] ? '扣款成功' : '扣款失敗' }}
                    </template>
                    <template v-else>
                      {{ getDisplayValue(row[col.key]) }}
                    </template>
                  </div>
                  <!-- 英數日期 -->
                  <div v-if="col.type === TableColumnType.EN_NUMBER" class="body-r-web-en">
                    {{ getDisplayValue(row[col.key]) }}
                  </div>
                  <!-- 幣別金額趴數 -->
                  <div v-if="col.type === TableColumnType.CURRENCY" class="body-r-web-en">
                    <template
                      v-if="
                        row[col.key] && typeof row[col.key] === 'object' && row[col.key].currency
                      "
                    >
                      {{ row[col.key].currency }} {{ row[col.key].text }}
                    </template>
                    <template v-else>
                      {{ getDisplayValue(row[col.key]) }}
                    </template>
                  </div>
                  <!-- 基金狀態 -->
                  <div v-if="col.type === TableColumnType.STATUS">
                    <div
                      class="flex gap-1 flex-nowrap"
                      v-if="row[col.key] && Array.isArray(row[col.key]) && row[col.key].length > 0"
                    >
                      <Tag
                        :state="TagState.PRIMARY"
                        v-for="(tag, tagIndex) in row[col.key]"
                        :key="tagIndex"
                        :name="tag"
                      ></Tag>
                    </div>
                    <span v-else>--</span>
                  </div>
                  <!-- 報酬 -->
                  <div v-if="col.type === TableColumnType.REWARD" class="body-r-web-en">
                    <div v-if="row[col.key] && typeof row[col.key] === 'object'" class="text-right">
                      <div
                        class="flex gap-1 justify-end flex-nowrap"
                        :class="getRewardClass(row[col.key].type)"
                      >
                        <span class="flex flex-nowrap">
                          <IconBarrowUp
                            class="size-4 md:size-5 my-auto mr-1"
                            v-if="row[col.key].type === 'profit'"
                          />
                          <IconBarrowDown
                            class="size-4 md:size-5 my-auto mr-1"
                            v-if="row[col.key].type === 'loss'"
                          />
                          <span>{{ row[col.key].currency }} {{ row[col.key].text }}</span>
                        </span>
                        <span>{{ row[col.key].desc }}</span>
                      </div>
                    </div>
                    <span v-else>{{ getDisplayValue(row[col.key]) }}</span>
                  </div>
                  <!-- 出入金狀態 -->
                  <div v-if="col.type === TableColumnType.TRANSACTION">
                    <div
                      class="flex items-center gap-2 flex-nowrap whitespace-nowrap"
                      v-if="row[col.key]"
                    >
                      <span>{{ getDisplayValue(row[col.key]) }}</span>
                      <span
                        v-if="row.isPendingWithdrawal"
                        class="md:caption-r-web-tc inline-flex md:px-1.5 md:py-0.75 border rounded-[4px] text-[var(--content-semantic-warning)] border-current"
                      >
                        待出金
                      </span>
                    </div>
                    <span v-else>-</span>
                  </div>
                  <!-- 操作按鈕-CTA -->
                  <div v-if="col.type === TableColumnType.OPERATION_CTA && row.isPendingWithdrawal">
                    <slot name="operation-cta" :row="row" :rowIndex="rowIndex">
                      <ButtonCapsule
                        v-if="shouldShowCancelButton(row)"
                        :type="ButtonCapsuleType.BlockBlue"
                        @click="handleButtonClick(row.id)"
                      >
                        {{ col.buttonData?.title || '取消' }}
                      </ButtonCapsule>
                    </slot>
                  </div>
                  <!-- 操作按鈕-文字 -->
                  <div v-if="col.type === TableColumnType.OPERATION_TEXT">
                    <slot name="operation-text" :row="row" :rowIndex="rowIndex">
                      <TextButton
                        v-if="shouldShowTextButton(row)"
                        :type="ButtonType.PrimaryStress"
                        @click="handleInfoButtonClick(row.id)"
                      >
                        {{ col.buttonData?.title || '查看明細' }}
                      </TextButton>
                    </slot>
                  </div>
                </div>
              </div>
            </div>

            <!-- 加載更多狀態 -->
            <div
              v-if="props.loadData?.loading"
              class="py-2 flex justify-center items-center min-h-[40px]"
            >
              <div
                v-if="props.loadData?.hasMore"
                class="flex items-center gap-2 text-[var(--content-general-secondary)]"
              >
                <div
                  class="w-10 h-10 rounded-full animate-spin border-4 border-[var(--surface-gray-light)] border-t-[var(--container-general-divider)]"
                ></div>
              </div>
            </div>
          </div>
          <!-- 上下表身隱沒元素 -->
          <div
            class="absolute pointer-events-none left-0 right-0 h-10 z-[5] fade-top"
            v-show="showTopFade"
            :style="{ top: headerHeight + 'px' }"
          ></div>
          <div
            class="absolute pointer-events-none bottom-0 left-0 right-0 h-10 z-[5] fade-bottom"
            v-show="showBottomFade"
          ></div>
        </div>
      </div>

      <!-- 左右表頭隱沒元素 -->
      <div
        class="absolute pointer-events-none top-0 left-0 w-20 z-20 fade-left-header"
        v-show="showLeftFade"
        :style="{ height: headerHeight + 'px' }"
      ></div>
      <div
        class="absolute pointer-events-none top-0 right-0 w-20 z-20 fade-right-header"
        v-show="showRightFade"
        :style="{ height: headerHeight + 'px' }"
      ></div>

      <!-- 左右表身隱沒元素 -->
      <div
        class="absolute pointer-events-none bottom-0 left-0 w-20 z-[5] fade-left"
        v-show="showLeftFade"
        :style="{ top: headerHeight + 'px' }"
      ></div>
      <div
        class="absolute pointer-events-none bottom-0 right-0 w-20 z-[5] fade-right"
        v-show="showRightFade"
        :style="{ top: headerHeight + 'px' }"
      ></div>

      <!-- 自訂橫向滾動條 -->
      <div class="absolute bottom-0 left-0 right-1.5 h-1.5 z-10" v-show="showHorizontalScrollbar">
        <div
          class="w-full h-full bg-transparent rounded-md relative cursor-pointer"
          @click="onHorizontalTrackClick"
          ref="horizontalTrackRef"
        >
          <div
            class="absolute top-0 h-1.5 rounded-md cursor-pointer transition-colors duration-200 scrollbar-thumb-horizontal"
            :style="{
              width: horizontalThumbWidth + 'px',
              left: horizontalThumbLeft + 'px'
            }"
            @mousedown="onHorizontalThumbMouseDown"
            ref="horizontalThumbRef"
          ></div>
        </div>
      </div>

      <!-- 自訂縱向滾動條 -->
      <div
        class="absolute right-0 bottom-0 w-1.5 z-20"
        v-show="showVerticalScrollbar"
        :style="{ top: headerHeight + 'px', height: 'calc(100% - ' + headerHeight + 'px)' }"
      >
        <div
          class="w-full h-full bg-transparent rounded-md relative cursor-pointer"
          @click="onVerticalTrackClick"
          ref="verticalTrackRef"
        >
          <div
            class="absolute left-0 w-1.5 rounded cursor-pointer transition-colors duration-200 scrollbar-thumb-vertical"
            :style="{
              height: verticalThumbHeight + 'px',
              top: verticalThumbTop + 'px'
            }"
            @mousedown="onVerticalThumbMouseDown"
            ref="verticalThumbRef"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { TableColumnType, TableColumnAlign } from '@/enum/table.enum'
import { ButtonCapsuleType, ButtonType } from '@/enum/ui.enum'
import { TagState } from '@/enum/tagState.enum'
import type { TableProps } from '@/types/models/table.model'
import ButtonCapsule from '@/components/ButtonCapsule.vue'
import Tag from '@/components/Tag.vue'
import TextButton from '@/components/TextButton.vue'
import IconBarrowUp from '@/components/icons/IconBarrowUp.vue'
import IconBarrowDown from '@/components/icons/IconBarrowDown.vue'
import { useScrollTableLoad } from '@/composables/useTableLoadMore'
import { useTableScrollbars } from '@/composables/useTableScrollbars'
import { useTableColumnWidths } from '@/composables/useTableColumnWidths'

const props = defineProps<TableProps>()

const emit = defineEmits<{
  (e: 'load-more', tableId: string): void
  (e: 'button-click', id: string): void
  (e: 'info-click', id: string): void
}>()

/** 表格唯一識別符 */
const tableId = computed(() => (props.tableId ? `table-${props.tableId}` : `table`))

// DOM 元素引用
const tableContainerRef = ref<HTMLDivElement | null>(null)
const tableInnerRef = ref<HTMLDivElement | null>(null)
const tableHeaderRef = ref<HTMLDivElement | null>(null)
const bodyScrollRef = ref<HTMLDivElement | null>(null)
const scrollWrapperRef = ref<HTMLDivElement | null>(null)
const horizontalTrackRef = ref<HTMLDivElement | null>(null)
const horizontalThumbRef = ref<HTMLDivElement | null>(null)
const verticalTrackRef = ref<HTMLDivElement | null>(null)
const verticalThumbRef = ref<HTMLDivElement | null>(null)

/** 表頭高度 */
const headerHeight = ref(64)

/** 漸變遮罩狀態 */
const showTopFade = ref(false)
const showBottomFade = ref(false)
const showLeftFade = ref(false)
const showRightFade = ref(false)

// 動態過濾顯示的欄位
const filteredColumns = computed(() => {
  return props.columns.filter((col) => {
    // 隱藏欄位
    if (col.hidden) {
      return false
    }
    // 隱藏操作按鈕-CTA
    if (col.type === TableColumnType.OPERATION_CTA) {
      return props.data.some((row) => row.cancelWithdrawal === true)
    }
    // 隱藏操作按鈕-文字
    if (col.type === TableColumnType.OPERATION_TEXT) {
      return props.data.some((row) => row.viewDetails === true)
    }
    return true
  })
})

// 初始化滾動條管理
const scrollbarElements = {
  scrollWrapperRef,
  bodyScrollRef,
  horizontalTrackRef,
  horizontalThumbRef,
  verticalTrackRef,
  verticalThumbRef
}

const {
  showHorizontalScrollbar,
  showVerticalScrollbar,
  horizontalThumbWidth,
  horizontalThumbLeft,
  verticalThumbHeight,
  verticalThumbTop,
  onHorizontalTrackClick,
  onVerticalTrackClick,
  onHorizontalThumbMouseDown,
  onVerticalThumbMouseDown,
  updateHorizontalScrollbar,
  updateVerticalScrollbar,
  cleanup: cleanupScrollbars
} = useTableScrollbars(scrollbarElements)

// 初始化列寬管理
const columnWidthElements = {
  tableContainerRef,
  tableInnerRef
}

const {
  isResizing,
  gridStyle,
  setupResizeObserver,
  initializeColWidths,
  cleanup: cleanupColumnWidths
} = useTableColumnWidths(columnWidthElements, filteredColumns, tableId)

/**
 * 處理欄位顯示值，空值時顯示 '--'
 * @param value - 欄位值
 * @returns 顯示的值
 */
const getDisplayValue = (value: any) =>
  value === null || value === undefined || value === '' ? '--' : value

/**
 * 判斷是否為扣款失敗狀態
 * @param row - 表格行資料
 * @returns 是否為扣款失敗
 */
const isPaymentFailed = (row: Record<string, any>) =>
  row.depositWithdrawalStatus === '出金' && row.isPendingWithdrawal === true

/**
 * 判斷是否顯示取消出金按鈕
 * @param row - 表格行資料
 * @returns 是否顯示取消出金按鈕
 */
const shouldShowCancelButton = (row: Record<string, any>) => {
  // 使用新的參數結構：cancelWithdrawal 為 true 且 depositWithdrawalStatus 為 '出金'
  if (row.cancelWithdrawal !== undefined && row.depositWithdrawalStatus !== undefined) {
    return row.cancelWithdrawal && row.depositWithdrawalStatus === '出金'
  }
  // 其他情況不顯示
  return false
}

/**
 * 判斷是否顯示文字按鈕
 * @param row - 表格行資料
 * @returns 是否顯示文字按鈕
 */
const shouldShowTextButton = (row: Record<string, any>) => {
  // 判斷是否可以查看詳細資料
  if (row.viewDetails !== undefined) {
    return row.viewDetails && !isPaymentFailed(row)
  }

  return false
}

// 使用滾動加載更多 composable
const { checkLoadMore } = useScrollTableLoad({
  loading: computed(() => props.loadData?.loading || false),
  hasMore: computed(() => props.loadData?.hasMore || false),
  onLoadMore: () => emit('load-more', props.tableId || '')
})

/** 橫向滾動處理 */
const onHorizontalScroll = (event: Event) => {
  updateHorizontalScrollbar()
  updateHorizontalFadeStates()
}

/** 縱向滾動處理 */
const onVerticalScroll = (event: Event) => {
  updateVerticalScrollbar()
  updateVerticalFadeStates()

  // 檢查是否需要加載更多
  const target = event.target as HTMLElement
  const isLoadMore = checkLoadMore(target)
  if (isLoadMore) {
    emit('load-more', props.tableId || '')
  }
}

/** 更新橫向隱沒狀態 */
const updateHorizontalFadeStates = () => {
  if (!scrollWrapperRef.value) return

  const { scrollLeft, scrollWidth, clientWidth } = scrollWrapperRef.value
  const maxScrollLeft = scrollWidth - clientWidth

  showLeftFade.value = scrollLeft > 0 && maxScrollLeft > 0
  showRightFade.value = scrollLeft < maxScrollLeft && maxScrollLeft > 0
}

/** 更新縱向隱沒狀態 */
const updateVerticalFadeStates = () => {
  if (!bodyScrollRef.value) return

  const { scrollTop, scrollHeight, clientHeight } = bodyScrollRef.value
  const maxScrollTop = scrollHeight - clientHeight

  showTopFade.value = scrollTop > 0 && maxScrollTop > 0
  showBottomFade.value = scrollTop < maxScrollTop && maxScrollTop > 0
}

/** 更新表頭高度 */
const updateHeaderHeight = () => {
  if (!tableHeaderRef.value) return

  const height = tableHeaderRef.value.clientHeight
  if (height > 0) {
    headerHeight.value = height
  }
}

/** 判斷是否自動高度 */
const isHeightAuto = computed(() => {
  const rowHeight = 52 // 每行高度
  const totalRows = props.data.length
  const contentHeight = headerHeight.value + totalRows * rowHeight
  return contentHeight <= 300 // 如果內容高度不大於300px，自動高度
})

// 初始化列寬管理
const updateCallback = () => {
  updateHorizontalScrollbar()
  updateVerticalScrollbar()
  updateHorizontalFadeStates()
  updateVerticalFadeStates()
  updateHeaderHeight()
}

/** 掛載 */
onMounted(async () => {
  // 等待DOM完全渲染
  await nextTick()

  // 初始化列寬
  setTimeout(async () => {
    await initializeColWidths(updateCallback)

    // 設置 ResizeObserver
    setupResizeObserver(updateCallback)

    // 額外等待並強制重新計算滾動條狀態
    setTimeout(() => {
      updateHorizontalScrollbar()
      updateVerticalScrollbar()
      updateHorizontalFadeStates()
      updateVerticalFadeStates()
    }, 100)

    // 再次檢查滾動條狀態，確保初始化正確
    setTimeout(() => {
      updateHorizontalScrollbar()
      updateVerticalScrollbar()
      updateHorizontalFadeStates()
      updateVerticalFadeStates()
    }, 300)

    // 最後再次檢查，確保資料加載完成後滾動條狀態正確
    setTimeout(() => {
      updateHorizontalScrollbar()
      updateVerticalScrollbar()
      updateHorizontalFadeStates()
      updateVerticalFadeStates()
    }, 500)
  }, 100)
})

/** 卸載 */
onUnmounted(() => {
  // 清理 composables
  cleanupScrollbars()
  cleanupColumnWidths()
})

/**
 * 根據 isResizing 狀態返回對應的透明度 class
 * @returns CSS 類名
 */
const getResizingClass = () => {
  return isResizing.value
    ? 'opacity-0 transition-opacity duration-300 ease-in-out'
    : 'opacity-100 transition-opacity duration-300 ease-in-out'
}

/**
 * 根據損益類型返回對應的 CSS 類名
 * @param type - 損益類型：profit | loss | even
 * @returns CSS 類名
 */
const getRewardClass = (type: string) => {
  switch (type) {
    case 'profit':
      return 'text-[var(--content-semantic-ascend)]'
    case 'loss':
      return 'text-[var(--content-semantic-descend)]'
    case 'even':
      return 'text-[var(--content-general-primary)]'
    default:
      return 'text-[var(--content-general-primary)]'
  }
}

const handleButtonClick = (id: string) => {
  emit('button-click', id)
}

const handleInfoButtonClick = (id: string) => {
  emit('info-click', id)
}
</script>

<style scoped>
/* 橫向滾動包裝器 - 隱藏滾動條 */
.table-scroll-wrapper {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.table-scroll-wrapper::-webkit-scrollbar {
  display: none;
}

/* 表身滾動條隱藏 */
.table-body {
  scrollbar-width: none;
  -ms-overflow-style: none;
  overflow-y: auto !important;
}

/* 表身行分隔線 */
.table-body-row:not(:last-of-type)::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 20px;
  width: calc(100% - 40px);
  border-bottom: 1px solid #ddd;
  pointer-events: none;
}

/* 透明度漸變動畫（表格 resize 時用） */
.transition-opacity {
  transition: opacity 300ms;
}

/* 滾動條背景色和 hover 效果 */
.scrollbar-thumb-horizontal {
  background-color: var(--CDF-Color-Palette-grey-grey-200);
}

.scrollbar-thumb-horizontal:hover {
  background-color: var(--CDF-Color-Palette-grey-grey-200-hover);
}

.scrollbar-thumb-vertical {
  background-color: var(--CDF-Color-Palette-grey-grey-200);
}

.scrollbar-thumb-vertical:hover {
  background-color: var(--CDF-Color-Palette-grey-grey-200-hover);
}

/* 漸變遮罩效果 */
.fade-top {
  background: linear-gradient(180deg, #fff 0%, rgba(255, 255, 255, 0) 100%);
}

.fade-bottom {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #fff 100%);
}

.fade-left {
  background: linear-gradient(90deg, #fff 0%, rgba(255, 255, 255, 0) 100%);
}

.fade-right {
  background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, #fff 100%);
}

.fade-left-header {
  background: linear-gradient(90deg, #dceaff 0%, rgba(255, 255, 255, 0) 100%);
}

.fade-right-header {
  background: linear-gradient(90deg, rgba(220, 234, 255, 0) 0%, #dceaff 100%);
}
</style>
