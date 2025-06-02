document.addEventListener("DOMContentLoaded", loadTasks);

function addTask() { // Adicionar uma nova tarefa
  const taskInput = document.getElementById("new-task");
  const timeInput = document.getElementById("task-time");
  const dateInput = document.getElementById("task-date");

  const taskText = taskInput.value.trim();
  const taskTime = timeInput.value;
  const taskDate = dateInput.value;

  if (taskText === "") return;

  const tasks = getSavedTasks();
  tasks.push({ text: taskText, done: false, time: taskTime, date: taskDate });
  saveTasks(tasks);
  renderTasks();

  taskInput.value = "";
  timeInput.value = "";
  dateInput.value = "";
}



function deleteTask(index) { // Excluir uma tarefa
  const tasks = getSavedTasks();
  tasks.splice(index, 1);
  saveTasks(tasks);
  renderTasks();
}

function toggleDone(index) { // Marcar como concluída
  const tasks = getSavedTasks();
  tasks[index].done = !tasks[index].done;
  saveTasks(tasks);
  renderTasks();
}

function getSavedTasks() { // Tarefas salvas
  const saved = localStorage.getItem("tasks");
  return saved ? JSON.parse(saved) : [];
}

function saveTasks(tasks) { // Salvar tarefas
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() { // Mostrar tarefas
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

    const timeSpan = document.createElement("small");
    timeSpan.style.color = "#666";
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
    if (timeInfo.length) leftDiv.appendChild(timeSpan);

    li.appendChild(checkbox);
    li.appendChild(leftDiv);
    li.appendChild(delBtn);
    taskList.appendChild(li);
  });
}


function loadTasks() { // Quando carregar o site, chamar a funcão para exiber as tarefas
  renderTasks();
}
