<template>
  <div class="p-8">
		<h1 class="text-red-700 text-3xl font-bold mb-8">
			歡迎來到首頁
		</h1>
		
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			<!-- 表格页面 -->
			<div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
				<h2 class="text-xl font-semibold mb-3 text-gray-800">表格页面</h2>
				<p class="text-gray-600 mb-4">查看基础表格功能</p>
				<router-link 
					to="/table" 
					class="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
				>
					查看表格
				</router-link>
			</div>
			
			<!-- 测试表格 -->
			<div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
				<h2 class="text-xl font-semibold mb-3 text-gray-800">测试表格</h2>
				<p class="text-gray-600 mb-4">测试固定表头和横向滚动功能</p>
				<router-link 
					to="/test" 
					class="inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
				>
					查看测试表格
				</router-link>
			</div>
			
			<!-- Grid表格 -->
			<div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
				<h2 class="text-xl font-semibold mb-3 text-gray-800">Grid表格</h2>
				<p class="text-gray-600 mb-4">使用CSS Grid布局实现的表格组件</p>
				<router-link 
					to="/grid" 
					class="inline-block bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors"
				>
					查看Grid表格
				</router-link>
			</div>
			
			<!-- Table Container -->
			<div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
				<h2 class="text-xl font-semibold mb-3 text-gray-800">Table Container</h2>
				<p class="text-gray-600 mb-4">使用HTML Table实现的高级表格组件</p>
				<router-link 
					to="/table-container" 
					class="inline-block bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors"
				>
					查看Table Container
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