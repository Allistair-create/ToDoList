// Task data structure: { id, text, completed }
let tasks = [];
let filter = "all"; // "all", "active", "completed"

// DOM references
const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const filterBtns = document.querySelectorAll('.filter-btn');

// Modal References
const modal = document.getElementById('edit-modal');
const closeModalBtn = document.querySelector('.close-btn');
const editInput = document.getElementById('edit-input');
const saveEditBtn = document.getElementById('save-edit-btn');

let editingTaskId = null;

// ---- TASK RENDERING ----
function renderTasks() {
  // Filter tasks based on selected filter
  let filteredTasks = tasks;
  if (filter === "active") {
    filteredTasks = tasks.filter(t => !t.completed);
  } else if (filter === "completed") {
    filteredTasks = tasks.filter(t => t.completed);
  }

  // Clear list before render
  list.innerHTML = "";
  filteredTasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'todo-item' + (task.completed ? ' completed' : '') + ' enter';
    li.setAttribute('data-id', task.id);

    // Checkbox to mark complete
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'complete-checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleComplete(task.id));

    // Task text
    const taskSpan = document.createElement('span');
    taskSpan.className = 'task-text';
    taskSpan.textContent = task.text;
    taskSpan.title = "Click to edit";
    taskSpan.addEventListener('dblclick', () => openEditModal(task.id));

    // Action buttons
    const btnGroup = document.createElement('div');
    btnGroup.className = 'action-btns';

    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => openEditModal(task.id));

    const delBtn = document.createElement('button');
    delBtn.className = 'delete-btn';
    delBtn.textContent = 'Delete';
    delBtn.addEventListener('click', () => removeTask(task.id, li));

    btnGroup.appendChild(editBtn);
    btnGroup.appendChild(delBtn);

    li.appendChild(checkbox);
    li.appendChild(taskSpan);
    li.appendChild(btnGroup);

    list.appendChild(li);

    // Animation for newly added item
    setTimeout(() => li.classList.remove('enter'), 10);
  });
}

// ---- TASK OPERATIONS ----
function addTask(text) {
  const task = {
    id: Date.now().toString(),
    text,
    completed: false,
  };
  tasks.push(task);
  renderTasks();
}

function toggleComplete(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  renderTasks();
}

function removeTask(id, liElem) {
  // Add exit animation, then remove
  liElem.classList.add('exit');
  setTimeout(() => {
    tasks = tasks.filter(task => task.id !== id);
    renderTasks();
  }, 350);
}

// ---- EDITING ----
function openEditModal(id) {
  editingTaskId = id;
  const task = tasks.find(t => t.id === id);
  if (task) {
    editInput.value = task.text;
    modal.style.display = "flex";
    editInput.focus();
  }
}

function closeModal() {
  modal.style.display = "none";
  editingTaskId = null;
}

function saveEdit() {
  const newText = editInput.value.trim();
  if (editingTaskId && newText) {
    tasks = tasks.map(task =>
      task.id === editingTaskId ? { ...task, text: newText } : task
    );
    renderTasks();
    closeModal();
  }
}

// ---- FILTERING ----
filterBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    filterBtns.forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    filter = this.getAttribute('data-filter');
    renderTasks();
  });
});

// ---- EVENT LISTENERS ----
form.addEventListener('submit', function(event) {
  event.preventDefault();
  const task = input.value.trim();
  if (task !== '') {
    addTask(task);
    input.value = '';
  }
});

closeModalBtn.addEventListener('click', closeModal);
saveEditBtn.addEventListener('click', saveEdit);
editInput.addEventListener('keyup', function(e) {
  if (e.key === 'Enter') saveEdit();
});
window.addEventListener('click', function(event) {
  if (event.target === modal) closeModal();
});

// Initial render
renderTasks();
