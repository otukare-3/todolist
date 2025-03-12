const taskInput = document.getElementById("task-input");
const addButton = document.getElementById("add-button");
const taskList = document.getElementById("task-list");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

/**
 * タスクのリストをDOMにレンダリングします。
 * 現在のタスクリストをクリアし、tasks配列を反復処理して各タスクのリスト項目を作成して追加します。
 * 各リスト項目には、タスクを完了としてマークするためのチェックボックス、タスクのテキストを表示するためのスパン、
 * タスクを編集および削除するためのボタンが含まれています。
 */
function renderTask() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const listItem = document.createElement("li");
    listItem.classList.add("task-item");
    if (task.completed) {
      listItem.classList.add("completed");
    }
    listItem.innerHTML = `
      <input type="checkbox" ${task.completed ? "checked" : ""} />
      <span>${task.text}</span>
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
  if (taskText) {
    tasks.push({ text: taskText, completed: false });
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

renderTask();
