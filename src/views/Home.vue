<template>
  <div class="p-8">
		<h1 class="text-red-700 text-3xl font-bold mb-8">
			歡迎來到首頁
		</h1>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			<div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
				<h2 class="text-xl font-semibold mb-3 text-gray-800">Element表格</h2>
				<p class="text-gray-600 mb-4">查看Element表格功能</p>
				<router-link 
					to="/tableElementPlus" 
					class="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
				>
					查看表格
				</router-link>
			</div>
		</div>
  </div>
</template>

<script setup>
import { useMainStore } from '../stores'

const store = useMainStore()

</script> 

<style></style>