document.addEventListener("DOMContentLoaded", () => {
  requestNotificationPermission();
  loadTasks();
});

function requestNotificationPermission() {
  if (Notification.permission !== "granted" && Notification.permission !== "denied") {
    Notification.requestPermission();
  }
}

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

  const newTask = {
    text: taskText,
    desc: taskDesc,
    done: false,
    time: taskTime,
    date: taskDate,
    notified: false
  };

  const tasks = getSavedTasks();
  tasks.push(newTask);
  saveTasks(tasks);
  renderTasks();
  agendarNotificacao(newTask);

  taskInput.value = "";
  descInput.value = "";
  timeInput.value = "";
  dateInput.value = "";
}

function agendarNotificacao(task) {
  if (!task.date || !task.time || task.notified) return;

  const [ano, mes, dia] = task.date.split("-").map(Number);
  const [hora, minuto] = task.time.split(":").map(Number);
  const dataHoraAlvo = new Date(ano, mes - 1, dia, hora, minuto);
  const tempoRestante = dataHoraAlvo - new Date();

  if (tempoRestante > 0) {
    setTimeout(() => {
      new Notification("🚨 Tarefa Agendada", {
        body: `${task.text}\n${task.desc || ""}`.trim(),
      });

      // Marca como notificada
      const tasks = getSavedTasks();
      const index = tasks.findIndex(t =>
        t.text === task.text && t.date === task.date && t.time === task.time
      );
      if (index > -1) {
        tasks[index].notified = true;
        saveTasks(tasks);
      }

    }, tempoRestante);
  }
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
    if (task.done) span.classList.add("task-done");

    const descSpan = document.createElement("small");
    descSpan.style.color = "#e4e4e4";
    if (task.desc) descSpan.textContent = task.desc;

    const timeSpan = document.createElement("small");
    timeSpan.style.color = "#c5c5c5";
    const info = [];

    if (task.date) {
      const formattedDate = new Date(`${task.date}T00:00:00`).toLocaleDateString("pt-BR");
      info.push(`📅 ${formattedDate}`);
    }

    if (task.time) {
      info.push(`⏰ ${task.time}`);
    }

    timeSpan.textContent = info.join(" | ");

    const delBtn = document.createElement("button");
    delBtn.textContent = "Excluir";
    delBtn.onclick = () => deleteTask(index);

    leftDiv.appendChild(span);
    if (task.desc) leftDiv.appendChild(descSpan);
    if (info.length) leftDiv.appendChild(timeSpan);

    li.appendChild(checkbox);
    li.appendChild(leftDiv);
    li.appendChild(delBtn);
    taskList.appendChild(li);
  });
}

function loadTasks() {
  renderTasks();
  const tasks = getSavedTasks();
  tasks.forEach(agendarNotificacao);
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

// Registrar service worker (para PWA)
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js")
    .then(reg => console.log("SW registrado:", reg.scope))
    .catch(err => console.error("Erro ao registrar SW:", err));
}
