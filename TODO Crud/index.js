// DOM Elements
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

// Load tasks from local storage on page load
document.addEventListener("DOMContentLoaded", loadTasks);

// Add event listener to form submission
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const taskTitle = taskInput.value;
  addTask(taskTitle);
  taskInput.value = "";
});

// Load tasks function (Read)
function loadTasks() {
  const tasks = getTasksFromLocalStorage();
  taskList.innerHTML = ""; // Clear the task list before loading
  tasks.forEach((task) => {
    displayTask(task);
  });
}

// Get tasks from local storage
function getTasksFromLocalStorage() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

// Save tasks to local storage
function saveTasksToLocalStorage(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Display a task in the UI
function displayTask(task) {
  const li = document.createElement("li");
  li.setAttribute("data-id", task.id);
  li.innerHTML = `
        <span>${task.title}</span>
        <button onclick="deleteTask(${task.id})">Delete</button>
        <button onclick="editTask(${task.id}, '${task.title}')">Edit</button>
    `;
  taskList.appendChild(li);
}

// Add task function (Create)
function addTask(title) {
  const tasks = getTasksFromLocalStorage();
  const newTask = {
    id: Date.now(), // unique id based on timestamp
    title: title,
  };
  tasks.push(newTask);
  saveTasksToLocalStorage(tasks);
  displayTask(newTask); // Display the new task
}

// Delete task function (Delete)
function deleteTask(id) {
  const tasks = getTasksFromLocalStorage().filter((task) => task.id !== id);
  saveTasksToLocalStorage(tasks);
  loadTasks(); // Reload tasks to update the UI
}

// Edit task function (Update)
function editTask(id, currentTitle) {
  const newTitle = prompt("Edit task title:", currentTitle);
  if (newTitle) {
    const tasks = getTasksFromLocalStorage();
    const taskIndex = tasks.findIndex((task) => task.id === id);
    if (taskIndex > -1) {
      tasks[taskIndex].title = newTitle; // Update the task title
      saveTasksToLocalStorage(tasks);
      loadTasks(); // Reload tasks to update the UI
    }
  }
}
