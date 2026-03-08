let tasks = [];
let currentFilter = 'all';

// ── Load from localStorage ──
document.addEventListener("DOMContentLoaded", () => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (storedTasks) {
        tasks = storedTasks;
    }
    updateTasksList();
    updateStats();
    setupFilters();
});

// ── Save to localStorage ──
const saveTasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

// ── Add Task ──
const addTask = () => {
    const taskInput = document.getElementById('taskInput');
    const text = taskInput.value.trim();

    if (text) {
        tasks.push({ text: text, completed: false, createdAt: Date.now() });
        taskInput.value = "";
        saveTasks();
        updateTasksList();
        updateStats();
        taskInput.focus();
    }
};

// ── Toggle Complete ──
const toggleTaskComplete = (index) => {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    updateTasksList();
    updateStats();
};

// ── Delete Task ──
const deleteTask = (index) => {
    const taskList = document.getElementById("task-list");
    const items = taskList.querySelectorAll('li');
    if (items[index]) {
        items[index].style.opacity = '0';
        items[index].style.transform = 'translateX(30px)';
        setTimeout(() => {
            tasks.splice(index, 1);
            saveTasks();
            updateTasksList();
            updateStats();
        }, 200);
    } else {
        tasks.splice(index, 1);
        saveTasks();
        updateTasksList();
        updateStats();
    }
};

// ── Edit Task ──
const editTask = (index) => {
    const taskInput = document.getElementById('taskInput');
    taskInput.value = tasks[index].text;
    taskInput.focus();
    tasks.splice(index, 1);
    saveTasks();
    updateTasksList();
    updateStats();
};

// ── Clear Completed ──
const clearCompleted = () => {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    updateTasksList();
    updateStats();
};

// ── Motivation Text ──
const getMotivation = (completed, total) => {
    if (total === 0) return "Let's get things done!";
    if (completed === total) return "All done! Great job! 🎉";
    if (completed / total >= 0.75) return "Almost there, keep going!";
    if (completed / total >= 0.5) return "Halfway there! Nice work!";
    if (completed > 0) return "Good start, keep it up!";
    return "Let's get things done!";
};

// ── Update Stats ──
const updateStats = () => {
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const progress = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
    const progressBar = document.getElementById('progress');

    progressBar.style.width = `${progress}%`;
    document.getElementById('numbers').innerText = `${completedTasks} / ${totalTasks}`;
    document.getElementById('motivationText').innerText = getMotivation(completedTasks, totalTasks);

    // Show/hide clear completed button
    const clearBtn = document.getElementById('clearCompleted');
    if (completedTasks > 0) {
        clearBtn.style.display = 'block';
    } else {
        clearBtn.style.display = 'none';
    }
};

// ── Filter logic ──
const getFilteredTasks = () => {
    if (currentFilter === 'active') return tasks.map((t, i) => ({ ...t, _idx: i })).filter(t => !t.completed);
    if (currentFilter === 'completed') return tasks.map((t, i) => ({ ...t, _idx: i })).filter(t => t.completed);
    return tasks.map((t, i) => ({ ...t, _idx: i }));
};

const setupFilters = () => {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            updateTasksList();
        });
    });
};

// ── SVG Icons ──
const trashIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`;
const editIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`;

// ── Render Task List ──
const updateTasksList = () => {
    const taskList = document.getElementById("task-list");
    const emptyState = document.getElementById("emptyState");
    taskList.innerHTML = '';

    const filtered = getFilteredTasks();

    if (filtered.length === 0) {
        emptyState.style.display = 'flex';
        if (tasks.length === 0) {
            emptyState.querySelector('p').textContent = 'No tasks yet. Add one above!';
        } else {
            emptyState.querySelector('p').textContent = currentFilter === 'active' ? 'No active tasks!' : 'No completed tasks!';
        }
    } else {
        emptyState.style.display = 'none';
    }

    filtered.forEach((task) => {
        const realIndex = task._idx;
        const listItem = document.createElement("li");
        listItem.style.transition = 'opacity 0.2s, transform 0.2s';

        listItem.innerHTML = `
        <div class="taskItem">
            <div class="task ${task.completed ? 'completed' : ''}">
                <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''}>
                <p>${escapeHTML(task.text)}</p>
            </div>
            <div class="icons">
                <button class="icon-btn edit" title="Edit" onclick="editTask(${realIndex})">${editIcon}</button>
                <button class="icon-btn delete" title="Delete" onclick="deleteTask(${realIndex})">${trashIcon}</button>
            </div>
        </div>
        `;
        listItem.addEventListener("change", () => toggleTaskComplete(realIndex));
        taskList.append(listItem);
    });
};

// ── Escape HTML to prevent XSS ──
const escapeHTML = (str) => {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
};

// ── Event Listeners ──
document.getElementById('newTask').addEventListener('click', function (e) {
    e.preventDefault();
    addTask();
});

document.getElementById('taskInput').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        addTask();
    }
});

document.getElementById('clearCompleted').addEventListener('click', clearCompleted);