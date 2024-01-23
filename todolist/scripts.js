const newTaskText = document.getElementById("newTaskText");
const addButton = document.getElementById("button-addon2");
const taskList = document.getElementById("taskList");
const clearCompletedTasksButton = document.getElementById(
    "clear-completed-tasks"
);
const showCompletedTasksButton = document.getElementById("show-complated");
const showUncompletedTasksButton = document.getElementById("show-uncompleted");
const showAllTasksButton = document.getElementById("show-all");
let id = 0;

// load the tasks from local storage upon page load
loadTasks();

addButton.addEventListener("click", () => {
    rerenderAllTasks();
    addTask(newTaskText.value);
    newTaskText.value = "";
    saveTasks();
});

newTaskText.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        rerenderAllTasks();
        addTask(newTaskText.value);
        newTaskText.value = "";
        saveTasks();
    }
});

clearCompletedTasksButton.addEventListener("click", () => {
    const allTasksSavedInLocalStorage = localStorage.getItem("todolist-tasks");
    const allTasks = JSON.parse(allTasksSavedInLocalStorage);

    // filtering out all the completed tasks, keeping the uncompleted ones
    const uncompletedTasks = allTasks.filter((task) => task.completed === false);
    localStorage.setItem("todolist-tasks", JSON.stringify(uncompletedTasks));
    // remove all the tasks from the ul
    taskList.replaceChildren();
    // load the tasks from local storage
    loadTasks();
});

showCompletedTasksButton.addEventListener("click", () => {
    const allTasksSavedInLocalStorage = localStorage.getItem("todolist-tasks");
    const allTasks = JSON.parse(allTasksSavedInLocalStorage);

    // filtering out all the uncompleted tasks, keeping the completed ones
    const completedTasks = allTasks.filter((task) => task.completed === true);
    // remove all the tasks from the ul
    taskList.replaceChildren();
    // render the completed tasks
    renderTasks(completedTasks);
});

showUncompletedTasksButton.addEventListener("click", () => {
    const allTasksSavedInLocalStorage = localStorage.getItem("todolist-tasks");
    const allTasks = JSON.parse(allTasksSavedInLocalStorage);

    // filtering out all the uncompleted tasks, keeping the completed ones
    const uncompletedTasks = allTasks.filter((task) => task.completed === false);
    // remove all the tasks from the ul
    taskList.replaceChildren();
    // render the completed tasks
    renderTasks(uncompletedTasks);
});

showAllTasksButton.addEventListener("click", rerenderAllTasks);

// add a task to the list (ul)
function addTask(task, completed) {
    // if the task that's passed in is empty ("", null, undefined) then return
    if (!task) {
        // stops the function from continuing
        return;
    }

    const li = document.createElement("li");
    li.classList.add(
        "list-group-item",
        "d-flex",
        "justify-content-between",
        "align-items-center"
    );

    if (completed) {
        li.classList.add("completed");
    }

    const inputContainer = document.createElement("div");
    const checkbox = document.createElement("input");
    checkbox.classList.add("form-check-input", "me-1");
    checkbox.checked = completed;
    checkbox.setAttribute("type", "checkbox");
    checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
            li.classList.add("completed");
        } else {
            li.classList.remove("completed");
        }
        saveTasks();
    });
    const checkboxId = "checkbox" + id; // checkbox0, checkbox1, checkbox2, ...
    id++; // id = id + 1; increment the id by 1
    checkbox.setAttribute("id", checkboxId);
    const label = document.createElement("label");
    label.classList.add("form-check-label");
    label.setAttribute("for", checkboxId);
    label.innerText = task;
    inputContainer.appendChild(checkbox);
    inputContainer.appendChild(label);

    const deleteContainer = document.createElement("div");
    deleteContainer.classList.add("pointer");
    const trashIcon = document.createElement("i");
    trashIcon.classList.add("fa-solid", "fa-trash-can");
    deleteContainer.appendChild(trashIcon);
    deleteContainer.addEventListener("click", () => {
        li.remove();
        saveTasks();
    });

    li.appendChild(inputContainer);
    li.appendChild(deleteContainer);

    taskList.appendChild(li);
}

// save the tasks to local storage
function saveTasks() {
    const tasks = [];
    const taskItems = document.querySelectorAll("#taskList li");
    taskItems.forEach((liElement) => {
        const taskItem = {
            labelText: liElement.textContent.trim(),
            completed: liElement.classList.contains("completed"),
        };
        tasks.push(taskItem);
    });
    localStorage.setItem("todolist-tasks", JSON.stringify(tasks));
}

// load the tasks from local storage
function loadTasks() {
    const tasksSavedInLocalStorage = localStorage.getItem("todolist-tasks");
    const tasks = JSON.parse(tasksSavedInLocalStorage);
    // Tasks look like this:
    // [
    //   { labelText: "Hello", completed: false },
    //   { labelText: "World!", completed: false },
    //   { labelText: "Brush", completed: false },
    //   { labelText: "New", completed: false },
    // ];
    renderTasks(tasks);
}

function renderTasks(tasks) {
    if (!!tasks) {
        tasks.forEach((taskItem) => {
            addTask(taskItem.labelText, taskItem.completed);
        });
    }
}

function rerenderAllTasks() {
    const allTasksSavedInLocalStorage = localStorage.getItem("todolist-tasks");
    const allTasks = JSON.parse(allTasksSavedInLocalStorage);
    // remove all the tasks from the ul
    taskList.replaceChildren();
    // render the completed tasks
    renderTasks(allTasks);
}