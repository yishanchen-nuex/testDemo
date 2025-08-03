<template>
  <div class="w-full">
    <!-- <component :is="currentTableComponent" v-bind="tableProps" v-on="tableEvents" /> -->
  </div>
</template>

<script setup lang="ts">
// import { ref, computed, onMounted, onUnmounted } from 'vue'
// import { useGlobalEventStore } from '@/stores/globalEvent.store'
// import { DeviceType } from '@/enum/ui.enum'
// import type { TableProps } from '@/types/models/table.model'
// import TableViewDesktop from '@/components/TableViewDesktop.vue'
// import TableViewMobileWhiteBg from '@/components/TableViewMobileWhiteBg.vue'
// import TableViewMobileFundName from '@/components/TableViewMobileFundName.vue'
// import TableViewMobileNoBg from '@/components/TableViewMobileNoBg.vue'

// interface Props extends TableProps {}

// const props = withDefaults(defineProps<Props>(), {
//   tableType: 'whiteBg',
//   loadData: () => ({
//     currentPage: 1,
//     pageSize: 12,
//     loading: false,
//     hasMore: false
//   })
// })

// const emit = defineEmits<{
//   (e: 'load-more'): void
//   (e: 'button-click', id: string): void
//   (e: 'info-click', id: string): void
// }>()

// // 使用全局事件 store
// const globalEventStore = useGlobalEventStore()

// // 獲取設備類型和視窗資訊
// const deviceType = computed(() => globalEventStore.deviceType)

// onMounted(() => {
//   // 訂閱視窗大小變化事件
//   globalEventStore.subscribeResizeEvent()
// })

// const tableComponentMap = computed(() => {
//   if (deviceType.value === DeviceType.Mobile || deviceType.value === DeviceType.Tablet) {
//     if (props.tableType === 'whiteBg') return TableViewMobileWhiteBg
//     if (props.tableType === 'fundName') return TableViewMobileFundName
//     if (props.tableType === 'noBg') return TableViewMobileNoBg
//   }
//   return TableViewDesktop
// })

// const currentTableComponent = tableComponentMap

// const tableProps = computed(() => {
//   // 根據不同 component 傳遞不同 props
//   if (currentTableComponent.value === TableViewDesktop) {
//     return { ...props }
//   }
//   return {
//     data: props.data,
//     columns: props.columns
//   }
// })

// /** 按鈕 */
// const handleButtonClick = (id: string) => {
//   emit('button-click', id)
// }

// /** 資訊按鈕 */
// const handleInfoButtonClick = (id: string) => {
//   emit('info-click', id)
// }

// /** 載入更多 */
// const handleTableLoadMore = () => {
//   emit('load-more')
// }

// const tableEvents = {
//   'button-click': handleButtonClick,
//   'info-click': handleInfoButtonClick,
//   'load-more': handleTableLoadMore
// }
</script>

<style scoped></style>
