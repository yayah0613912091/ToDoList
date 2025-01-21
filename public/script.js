document.addEventListener('DOMContentLoaded', () => {
    const addBtn = document.getElementById('add-btn');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const filterSelect = document.getElementById('filter-select');

    // Load todos from localStorage
    loadTodos();

    addBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });

    filterSelect.addEventListener('change', filterTodos);

    function addTodo() {
        const taskText = todoInput.value.trim();
        if (taskText === '') return;

        const li = createTodoElement(taskText);
        todoList.appendChild(li);

        saveTodos();
        todoInput.value = '';
    }

    function createTodoElement(taskText) {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${taskText}</span>
            <button class="complete-btn">&#10003;</button>
            <button class="delete-btn">&#10060;</button>
        `;

        li.querySelector('.complete-btn').addEventListener('click', () => {
            li.querySelector('span').classList.toggle('completed');
            saveTodos();
            filterTodos(); // Update the list based on the current filter
        });

        li.querySelector('.delete-btn').addEventListener('click', () => {
            li.remove();
            saveTodos();
            filterTodos(); // Update the list based on the current filter
        });

        return li;
    }

    function saveTodos() {
        const todos = [];
        todoList.querySelectorAll('li').forEach(todo => {
            todos.push({
                text: todo.querySelector('span').textContent,
                completed: todo.querySelector('span').classList.contains('completed')
            });
        });
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    function loadTodos() {
        const savedTodos = JSON.parse(localStorage.getItem('todos')) || [];
        savedTodos.forEach(todo => {
            const li = createTodoElement(todo.text);
            if (todo.completed) {
                li.querySelector('span').classList.add('completed');
            }
            todoList.appendChild(li);
        });
    }

    function filterTodos() {
        const filterValue = filterSelect.value;
        const todos = todoList.getElementsByTagName('li');

        for (let todo of todos) {
            const isCompleted = todo.querySelector('span').classList.contains('completed');
            if (filterValue === 'all') {
                todo.style.display = '';
            } else if (filterValue === 'complete') {
                todo.style.display = isCompleted ? '' : 'none';
            } else if (filterValue === 'incomplete') {
                todo.style.display = isCompleted ? 'none' : '';
            }
        }
    }
});
