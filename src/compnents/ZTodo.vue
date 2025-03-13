<style lang="css" scoped>
.todo-container {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
    border-radius: 5px;
}

.input-group {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

input[type="text"] {
    flex: 1;
    padding: 8px;
    font-size: 16px;
}

button {
    padding: 8px 16px;
    border: none;
    border-radius: 3px;
    cursor: pointer;
}

button.primary {
    background-color: #4CAF50;
    color: white;
}

button.primary:hover {
    background-color: #45a049;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    display: flex;
    align-items: center;
    padding: 10px;
    margin: 5px 0;
    background-color: #f9f9f9;
    border-radius: 3px;
}

.delete-btn {
    margin-left: auto;
    background-color: #ff4444;
    color: white;
}

.delete-btn:hover {
    background-color: #cc0000;
}

.completed {
    text-decoration: line-through;
    color: #888;
}
</style>


<template>
    <div class="todo-container">
        <h1>Vue Todo List</h1>
        <div class="input-group">
            <input type="text" :value="newTodo" @input="onInput" placeholder="添加新任务..." @keypress.enter="addTodo">
            <button class="primary" @click="addTodo">添加</button>
        </div>
        <ul v-if="todos.length > 0">
            <li v-for="(todo, index) in todos" :key="todo.id" :class="{ completed: todo.completed }">
                <span>{{ todo.text }}</span>
                <button class="primary" @click="toggleComplete(index)">
                    {{ todo.completed ? '未完成' : '完成' }}
                </button>
                <button class="delete-btn" @click="removeTodo(index)">
                    删除
                </button>
            </li>
        </ul>
        <div v-else>
            <p>暂无任务，添加一个新任务吧！</p>
        </div>
    </div>
</template>

<script>
import { ref, watch } from 'vue';

export default {
    name: 'ZTodo',
    setup() {
        // console.log(ref);
        
        let newTodo = ref('');
        let todos = ref([]);

        const addTodo = () => {
            const text = newTodo.value.trim();

            if (!text) return;

            todos.value.push({
                id: Date.now(),
                text: text,
                completed: false
            });
            newTodo.value = '';
        };

        const removeTodo = (index) => {
            todos.value.splice(index, 1);
        };

        const toggleComplete = (index) => {
            todos.value[index].completed = !todos.value[index].completed;
        };

        const onInput = function(e) {
            console.log(e);
            
            newTodo.value = e.target.value
        }

        // 在 setup() 中添加
        // 读取本地存储
        const savedTodos = localStorage.getItem('todos');
        todos.value = savedTodos ? JSON.parse(savedTodos) : [];

        // 监听 todos 变化
        watch(todos.value, (newVal) => {
            localStorage.setItem('todos', JSON.stringify(newVal));
        }, { deep: true });

        return {
            newTodo,
            todos,
            onInput,
            addTodo,
            removeTodo,
            toggleComplete
        };
    }
}
</script>