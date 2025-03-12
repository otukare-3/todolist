const taskInput = document.getElementById("task-input");
const addButton = document.getElementById("add-button");
const taskList = document.getElementById("task-list");
const statusFilterRadios = document.querySelectorAll(
  'input[name="status-filter"]'
);
const categoryFilterRadios = document.querySelectorAll(
  'input[name="category-filter"]'
);
const categorySelect = document.getElementById("category-select");
const deadlineInput = document.getElementById("deadline-input");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let statusFilter = "all";
let categoryFilter = "all";

/**
 * タスクのリストをDOMにレンダリングします。
 * 現在のタスクリストをクリアし、tasks配列を反復処理して各タスクのリスト項目を作成して追加します。
 * 各リスト項目には、タスクを完了としてマークするためのチェックボックス、タスクのテキストを表示するためのスパン、
 * タスクを編集および削除するためのボタンが含まれています。
 */
function renderTask() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    if (statusFilter === "active" && task.completed) return;
    if (statusFilter === "completed" && !task.completed) return;
    if (categoryFilter !== "all" && task.category !== categoryFilter) return;

    const listItem = document.createElement("li");
    listItem.classList.add("task-item");
    if (task.completed) {
      listItem.classList.add("completed");
    }
    listItem.innerHTML = `
      <input type="checkbox" ${task.completed ? "checked" : ""} />
      <p>[${task.category}]</p>
      <p>${task.text}</p>
      <p>(締切: ${task.deadline})</p>
      <button class="edit-button" data-index="${index}">編集</button>
      <button class="delete-button" data-index="${index}">削除</button>
    `;
    taskList.appendChild(listItem);
  });
}

/**
 * 現在のタスクリストをローカルストレージに保存します。
 * タスクはキー「tasks」の下にJSON文字列として保存されます。
 */
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

/**
 * タスクを追加するためのイベントリスナーを設定します。
 */
addButton.addEventListener("click", () => {
  const taskText = taskInput.value.trim();
  const category = categorySelect.value;
  const deadline = deadlineInput.value;
  if (taskText && category) {
    tasks.push({
      text: taskText,
      completed: false,
      category: category,
      deadline: deadline,
    });
    taskInput.value = "";
    saveTasks();
    renderTask();
  }
});

taskList.addEventListener("click", (event) => {
  if (event.target.type === "checkbox") {
    const index =
      event.target.parentElement.querySelector(".edit-button").dataset.index;

    tasks[index].completed = event.target.checked;

    saveTasks();

    renderTask();
  }

  if (event.target.classList.contains("delete-button")) {
    const index = event.target.dataset.index;

    tasks.splice(index, 1);

    saveTasks();

    renderTask();
  }

  if (event.target.classList.contains("edit-button")) {
    const index = event.target.dataset.index;

    const newText = prompt(
      "新しいテキストを入力してください",
      tasks[index].text
    );

    if (newText) {
      tasks[index].text = newText;
      saveTasks();
      renderTask();
    }
  }
});

statusFilterRadios.forEach((radio) => {
  radio.addEventListener("change", (event) => {
    statusFilter = event.target.value;
    renderTask();
  });
});

categoryFilterRadios.forEach((radio) => {
  radio.addEventListener("change", (event) => {
    categoryFilter = event.target.value;
    renderTask();
  });
});

renderTask();

function checkDeadlines() {
  const now = new Date();
  tasks.forEach((task) => {
    if (task.deadline && !task.completed) {
      const deadline = new Date(task.deadline);
      const diff = deadline.getTime() - now.getTime();
      const oneHour = 1000 * 60 * 60;
      if (diff > 0 && diff < oneHour) {
        alert(`締切が迫っています！[${task.text}]`);
      }
    }
  });
}

setInterval(checkDeadlines, 1000 * 60);
