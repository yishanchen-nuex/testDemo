import { ref, computed, nextTick, type Ref, type ComputedRef } from 'vue'
import { TableColumnType } from '@/enum/table.enum'

export interface ColumnWidthElements {
  tableContainerRef: Ref<HTMLDivElement | null> // 表格容器
  tableInnerRef: Ref<HTMLDivElement | null> // 表格內部
}

export interface TableColumn {
  key?: string
  label?: string
  align?: string
  type: string
}

/**
 * 表格列寬管理 composable
 * 處理動態列寬計算、文字折行邏輯和響應式調整
 */
export function useTableColumnWidths(
  elements: ColumnWidthElements,
  filteredColumns: ComputedRef<TableColumn[]>,
  tableId: ComputedRef<string>
) {
  // 列寬狀態
  const maxColWidths = ref<number[]>([])
  // 是否正在調整列寬
  const isResizing = ref(false)
  const currentContainerWidth = ref(0)
  // 記錄最初的欄位內容寬度
  const originalWidths = ref<number[]>([])

  // 非響應式狀態
  let resizeObserver: ResizeObserver | null = null
  let resizeTimeout: number | null = null
  let lastContainerWidth: number | null = null

  /**
   * 更新列寬計算
   */
  const updateColWidths = async () => {
    if (!elements.tableContainerRef.value) return

    currentContainerWidth.value = elements.tableContainerRef.value.clientWidth

    // 只要寬度沒變，就直接跳過
    if (lastContainerWidth !== null && currentContainerWidth.value === lastContainerWidth) {
      return
    }

    isResizing.value = true

    // 更新記錄
    lastContainerWidth = currentContainerWidth.value

    // 等待 DOM 完全渲染
    await nextTick()

    // 欄位數量
    const colCount = filteredColumns.value.length
    if (colCount === 0) {
      finishResizing()
      return
    }

    // 常數
    const MAX_COLUMN_WIDTH = 200
    const ROW_PADDING = 40
    const COLUMN_GAP = 40

    // 如果還沒有記錄原始寬度，先記錄
    if (originalWidths.value.length === 0) {
      const widths: number[] = []

      for (let i = 0; i < colCount; i++) {
        // 最大寬度
        let maxWidth = 0

        // 取得所有 cell（表頭+表身）
        const cellEls = [
          ...Array.from(document.getElementsByClassName(`${tableId.value}-cell-${i}`))
        ] as HTMLElement[]

        cellEls.forEach((el) => {
          const rect = el.getBoundingClientRect()
          const width = Math.ceil(rect?.width ?? 0)
          maxWidth = Math.max(maxWidth, width)
        })
        widths[i] = maxWidth
      }
      originalWidths.value = widths
    }

    // 計算整體間距與剩餘空間
    const availableWidth = currentContainerWidth.value - ROW_PADDING
    const gapTotalWidth = (colCount - 1) * COLUMN_GAP
    const remainingWidth = availableWidth - gapTotalWidth
    const totalOriginalWidth = originalWidths.value.reduce((sum, w) => sum + w, 0)

    if (totalOriginalWidth > remainingWidth) {
      // 超過表格寬度，最大200
      maxColWidths.value = originalWidths.value.map((w) => Math.min(w, MAX_COLUMN_WIDTH))
    } else {
      // 未超過，等寬填滿
      const evenWidth = Math.floor(remainingWidth / colCount)
      const extra = remainingWidth % colCount
      maxColWidths.value = originalWidths.value.map((_, idx) => evenWidth + (idx < extra ? 1 : 0))
    }

    // 動畫結束後取消 isResizing
    finishResizing()
  }

  /**
   * 完成列寬調整
   * 延遲 50ms 後重置 isResizing 狀態，確保 UI 動畫完成
   */
  const finishResizing = () => {
    setTimeout(() => {
      isResizing.value = false
    }, 300)
  }

  /**
   * 監聽表格容器寬度的變化
   * 當表格容器寬度變化時，重新計算列寬
   */
  const setupResizeObserver = (updateCallback?: () => void) => {
    const el = elements.tableContainerRef.value
    if (!el) return

    // 斷開舊的 observer（避免重複監聽）
    if (resizeObserver) {
      resizeObserver.disconnect()
    }

    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width

        // 如果寬度沒變，就跳過
        if (lastContainerWidth !== null && newWidth === lastContainerWidth) {
          return
        }

        // 清 debounce
        if (resizeTimeout) {
          clearTimeout(resizeTimeout)
        }

        // debounce 後真正跑 updateColWidths
        resizeTimeout = window.setTimeout(async () => {
          await updateColWidths()
          if (updateCallback) updateCallback()
        }, 100)
      }
    })

    resizeObserver.observe(el)
  }

  /**
   * 初始化列寬
   */
  const initializeColWidths = async (updateCallback?: () => void) => {
    // 確保初始狀態
    isResizing.value = false

    // 等待 DOM
    await nextTick()

    // 第一次計算
    await updateColWidths()

    // 呼叫外部傳入的更新函式（如更新滾動條）
    if (updateCallback) {
      updateCallback()
    }
  }

  /**
   * 清理資源
   */
  const cleanup = () => {
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

    // 重置狀態
    lastContainerWidth = 0
    isResizing.value = false
    originalWidths.value = [] // 重置原始寬度
  }

  /**
   * 計算 Grid 樣式
   */
  const gridStyle = computed(() => {
    const cols =
      maxColWidths.value.length > 0
        ? maxColWidths.value.map((width) => width + 'px')
        : filteredColumns.value.map(() => 'max-content')

    return {
      gridTemplateColumns: cols.join(' ')
    }
  })

  return {
    // 狀態
    maxColWidths,
    isResizing,
    gridStyle,

    // 方法
    updateColWidths,
    setupResizeObserver,
    initializeColWidths,
    cleanup
  }
}
