<template>
  <nav class="bg-white border-b border-gray-300">
    <div class="text-center flex justify-center gap-2">
      <router-link
        v-for="route in navigationRoutes"
        :key="route.path"
        :to="route.path"
        class="text-blue-700 bg-blue-200 p-1 rounded transition-colors"
      >
        {{ route.title }}
      </router-link>
    </div>
  </nav>
</template>

<script setup>
// 导航路由配置
const navigationRoutes = [
  {
    path: '/',
    title: '首頁',
  },
  {
    path: '/tableElementPlus',
    title: 'Element表格',
  },
  {
    path: '/todoListDefult',
    title: 'Todo List',
  },
]
</script>
<style lang=""></style>
