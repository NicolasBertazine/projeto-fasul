// Solicita permissão ao carregar a página
if (Notification.permission === "default") {
  Notification.requestPermission().then(permission => {
    if (permission === "denied") {
      alert("Você bloqueou as notificações. Ative-as nas configurações do navegador se quiser recebê-las.");
    }
  });
} else if (Notification.permission === "denied") {
  alert("Você bloqueou as notificações. Ative-as nas configurações do navegador se quiser recebê-las.");
}

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
  const newTask = {
    text: taskText,
    desc: taskDesc,
    done: false,
    time: taskTime,
    date: taskDate
  };

  tasks.push(newTask);
  saveTasks(tasks);
  renderTasks();
  agendarNotificacao(newTask);

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
    if (task.desc) leftDiv.appendChild(descSpan);
    if (timeInfo.length) leftDiv.appendChild(timeSpan);

    li.appendChild(checkbox);
    li.appendChild(leftDiv);
    li.appendChild(delBtn);
    taskList.appendChild(li);
  });
}

function loadTasks() {
  renderTasks();

  // Ao carregar a página, agenda as notificações futuras
  const tasks = getSavedTasks();
  tasks.forEach(task => agendarNotificacao(task));
}

function agendarNotificacao(task) {
  if (!task.date || !task.time) return;

  const [ano, mes, dia] = task.date.split('-').map(Number);
  const [hora, minuto] = task.time.split(':').map(Number);
  const dataHora = new Date(ano, mes - 1, dia, hora, minuto);
  const tempoRestante = dataHora.getTime() - Date.now();

  if (tempoRestante > 0) {
    setTimeout(() => {
      if (Notification.permission === "granted") {
        new Notification("🚨 Tarefa Agendada", {
          body: `${task.text}\n${task.desc}`,
        });
      }
    }, tempoRestante);
  }
}
