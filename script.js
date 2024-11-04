const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
const notifications = document.getElementById('notifications');
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Função para atualizar a lista de tarefas
function renderTasks(filter = 'all') {
    taskList.innerHTML = '';
    const filteredTasks = filterTasks(filter);

    filteredTasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span style="text-decoration: ${task.completed ? 'line-through' : 'none'};">
                ${task.name} - ${task.dueDate} - ${task.priority}
            </span>
            <div>
                <button class="toggle" onclick="toggleCompletion(${index})">
                    ${task.completed ? 'Marcar como Pendente' : 'Marcar como Concluída'}
                </button>
                <button class="edit" onclick="editTask(${index})">Editar</button>
                <button class="delete" onclick="deleteTask(${index})">Excluir</button>
            </div>
        `;
        taskList.appendChild(li);
    });
}

// Função para adicionar uma nova tarefa
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskName = document.getElementById('taskName').value;
    const dueDate = document.getElementById('dueDate').value;
    const priority = document.getElementById('priority').value;

    const newTask = { name: taskName, dueDate, priority, completed: false };
    tasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
    taskForm.reset();
});

// Função para editar uma tarefa
function editTask(index) {
    const task = tasks[index];
    document.getElementById('taskName').value = task.name;
    document.getElementById('dueDate').value = task.dueDate;
    document.getElementById('priority').value = task.priority;

    deleteTask(index);
}

// Função para excluir uma tarefa
function deleteTask(index) {
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

// Função para marcar uma tarefa como concluída
function toggleCompletion(index) {
    tasks[index].completed = !tasks[index].completed;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

// Função para filtrar tarefas
function filterTasks(filter) {
    if (filter === 'concluded') return tasks.filter(task => task.completed);
    if (filter === 'pending') return tasks.filter(task => !task.completed);
    return tasks;
}

// Filtros de status
document.getElementById('filterAll').addEventListener('click', () => renderTasks('all'));
document.getElementById('filterConcluded').addEventListener('click', () => renderTasks('concluded'));
document.getElementById('filterPending').addEventListener('click', () => renderTasks('pending'));

// Ordenar por prioridade
document.getElementById('sortPriority').addEventListener('click', () => {
    tasks.sort((a, b) => {
        const priorities = { 'baixa': 1, 'media': 2, 'alta': 3 };
        return priorities[a.priority] - priorities[b.priority];
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
});

// Função para exibir notificações
function showNotifications() {
    const now = new Date();
    tasks.forEach(task => {
        const dueDate = new Date(task.dueDate);
        const timeDiff = dueDate - now;

        if (timeDiff < 86400000 && timeDiff > 0) { // Menos de 24 horas
            notifications.innerHTML += `<p>A tarefa "${task.name}" está próxima do prazo de conclusão!</p>`;
        }
    });
}

// Carregar tarefas ao iniciar
window.onload = () => {
    renderTasks();
    showNotifications();
};
