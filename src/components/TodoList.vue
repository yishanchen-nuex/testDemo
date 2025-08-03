<template>
  <div class="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md">
    <h1 class="text-2xl font-bold mb-4">Todo List</h1>
    <div class="flex mb-4">
      <input
        v-model="newTodo"
        @keyup.enter="addTodo"
        placeholder="Add a new todo"
        class="flex-grow p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        @click="addTodo"
        class="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600"
      >
        Add
      </button>
    </div>
    <ul>
      <li
        v-for="(todo, index) in todos"
        :key="index"
        class="flex items-center justify-between p-2 border-b"
      >
        <span :class="{ 'line-through': todo.completed }">{{ todo.text }}</span>
        <div>
          <button
            @click="toggleTodo(index)"
            class="text-green-500 hover:text-green-700 mr-2"
          >
            {{ todo.completed ? 'Undo' : 'Complete' }}
          </button>
          <button
            @click="removeTodo(index)"
            class="text-red-500 hover:text-red-700"
          >
            Remove
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Todo {
  text: string
  completed: boolean
}

const newTodo = ref('')
const todos = ref<Todo[]>([])

const addTodo = () => {
  if (newTodo.value.trim() !== '') {
    todos.value.push({ text: newTodo.value, completed: false })
    newTodo.value = ''
  }
}

const removeTodo = (index: number) => {
  todos.value.splice(index, 1)
}

const toggleTodo = (index: number) => {
  todos.value[index].completed = !todos.value[index].completed
}
</script>

<style scoped>
/* You can add additional styles here if needed */
</style>
