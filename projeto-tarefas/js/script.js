document.addEventListener("DOMContentLoaded", loadTasks);

function addTask() {
  const taskInput = document.getElementById("new-task");
  const descInput = document.getElementById("task-desc"); 
  const timeInput = document.getElementById("task-time");
  const dateInput = document.getElementById("task-date");

  const taskText = taskInput.value.trim();
  const taskDesc = descInput.value.trim(); 
  const taskTime = timeInput.value;
  const taskDate = dateInput.value;

  if (taskText === "") return;

  const tasks = getSavedTasks();
  tasks.push({
    text: taskText,
    desc: taskDesc, 
    done: false,
    time: taskTime,
    date: taskDate
  });

  saveTasks(tasks);
  renderTasks();

  taskInput.value = "";
  descInput.value = "";
  timeInput.value = "";
  dateInput.value = "";
}

function deleteTask(index) {
  const tasks = getSavedTasks();
  tasks.splice(index, 1);
  saveTasks(tasks);
  renderTasks();
}

function toggleDone(index) {
  const tasks = getSavedTasks();
  tasks[index].done = !tasks[index].done;
  saveTasks(tasks);
  renderTasks();
}

function getSavedTasks() {
  const saved = localStorage.getItem("tasks");
  return saved ? JSON.parse(saved) : [];
}

function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = "";
  const tasks = getSavedTasks();

  tasks.forEach((task, index) => {
    const li = document.createElement("li");

    const leftDiv = document.createElement("div");
    leftDiv.style.display = "flex";
    leftDiv.style.flexDirection = "column";
    leftDiv.style.flexGrow = "1";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.onchange = () => toggleDone(index);

    const span = document.createElement("span");
    span.textContent = task.text;
    if (task.done) {
      span.classList.add("task-done");
    }

    const descSpan = document.createElement("small");
    descSpan.style.color = "#e4e4e4";
    if (task.desc) {
      descSpan.textContent = task.desc;
    }

    const timeSpan = document.createElement("small");
    timeSpan.style.color = "#c5c5c5";
    const timeInfo = [];

    if (task.date) {
      const formattedDate = new Date(task.date).toLocaleDateString("pt-BR");
      timeInfo.push(`📅 ${formattedDate}`);
    }

    if (task.time) {
      timeInfo.push(`⏰ ${task.time}`);
    }

    timeSpan.textContent = timeInfo.join(" | ");

    const delBtn = document.createElement("button");
    delBtn.textContent = "Excluir";
    delBtn.onclick = () => deleteTask(index);

    leftDiv.appendChild(span);
    if (task.desc) leftDiv.appendChild(descSpan); // NOVO
    if (timeInfo.length) leftDiv.appendChild(timeSpan);

    li.appendChild(checkbox);
    li.appendChild(leftDiv);
    li.appendChild(delBtn);
    taskList.appendChild(li);
  });
}

function loadTasks() {
  renderTasks();
}
