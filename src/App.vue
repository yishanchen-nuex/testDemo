<script setup>
// 这里可以添加您的组件逻辑
</script>

<template>
  <div id="app">
    <nav class="bg-white">
      <div class="text-center flex justify-center gap-2">
        <router-link 
          to="/" 
          class="text-blue-700 bg-blue-200 p-1"
        >
          首頁
        </router-link>
        <router-link 
          to="/table"   
          class="text-blue-700 bg-blue-200 p-1"
        >
          Element表格
        </router-link>
        <router-link 
          to="/table-container-test"   
          class="text-blue-700 bg-blue-200 p-1"
        >
          表格容器測試
        </router-link>
        <router-link 
          to="/table-grid-test"   
          class="text-blue-700 bg-blue-200 p-1"
        >
          Grid表格測試
        </router-link>
        <router-link 
          to="/test"   
          class="text-blue-700 bg-blue-200 p-1"
        >
          test
        </router-link>
      </div>
    </nav>
    
    <router-view />
  </div>
</template>

<style>
/* 全局樣式將由 Tailwind CSS 處理 */
</style>
