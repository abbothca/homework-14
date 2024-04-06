"use strict";

// const
const TASKS_STORAGE_KEY = "tasks";

// DOM variables
const form = document.querySelector(".create-task-form");
const taskInput = document.querySelector(".task-input");
const taskList = document.querySelector(".collection");
const clearButton = document.querySelector(".clear-tasks");
const filterInput = document.querySelector(".filter-input");

// "storage" functions
const getTasksFromStorage = () => {
    return JSON.parse(localStorage.getItem(TASKS_STORAGE_KEY)) || [];
};

const storeTaskInStorage = (newTask) => {
    const tasks = getTasksFromStorage();
    tasks.push(newTask);

    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
};

const clearTasksFromStorage = () => {
    localStorage.removeItem(TASKS_STORAGE_KEY);
};

const removeTaskFromStorage = (index) => {
    const tasks = getTasksFromStorage();

    // @Liuba : видаляємо елмент масива з індексом indexOfRemovedLi
    tasks.splice(index, 1);

    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
};

const updateTaskInStorage = (newValue, index) => {
    const tasks = getTasksFromStorage();

    // @Liuba : записуємо нове значення
    tasks[index] = newValue;

    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
}

//

// "tasks" functions
// @Liuba : Згенерувати HTML структуру
const getLiTemplate = (value) => {
    return `
        <div class="collection__item">
            <span class="collection__value">${value}</span>
            <span class="collection__controls">
                <i class="fa fa-edit edit-item collection__button" role="button" tabindex="0" title="Редагувати завдання"></i>
                <i class="fa fa-remove delete-item collection__button" role="button" tabindex="0" title="Видалити завдання"></i>
            </span>
        </div>`
}

// @Liuba : модифікувала, додавши можлисість вставляти в позицію з індексом
const appendLi = (value) => {
    // Create and add LI element
    const li = document.createElement("li");
    li.innerHTML = getLiTemplate(value);

    taskList.append(li);
};

const getIndexOfLi = (li) => {
    return [...taskList.childNodes].indexOf(li);
};

// @Liuba : Редагувати елемент li
const editLi = (li) => {
    const value = prompt("New value", li.textContent.trim());

    if (!value) return;

    updateTaskInStorage(value, getIndexOfLi(li));
    // @Liuba : шукаємо елемент за класом collection__value і редагуємо значення
    li.querySelector(".collection__value").textContent = value;
    console.log("upd")
};
// @Liuba : Винесемо як окрему функцію видалення
const removeLi = (li) => {
    //@Liuba : визначаємо порядковий індекс li 
    const indexOfRemovedLi = getIndexOfLi(li);
    li.remove();

    // Видалити зі сховища 
    // @Liuba : елемент з індексом
    removeTaskFromStorage(indexOfRemovedLi);
}

const addTask = (event) => {
    event.preventDefault();

    // Перевірка на пусте значення
    const value = taskInput.value.trim();
    if (value === "") {
        return;
    }

    appendLi(value);

    // Очистити форму
    taskInput.value = "";
    // form.reset();

    // Фокусуємось на input
    taskInput.focus();

    // Зберігаємо елемент у localStorage
    storeTaskInStorage(value);
};

const clearTasks = () => {
    taskList.innerHTML = "";
    clearTasksFromStorage();
};

// @Liuba : перейменувала функцію і додала можливість не тільки видаляти, а й редагувати
const updateTaskList = ({ target }) => {
    const isDeleteButton = target.classList.contains("delete-item");
    const isEditButton = target.classList.contains("edit-item");
    if (!isDeleteButton && !isEditButton) {
        return;
    }

    const li = target.closest("li");

    if (isEditButton) {
        editLi(li);

        return;
    }

    const isConfirmed = confirm("Ви впевнені що хочете видалити це завдання?");
    if (!isConfirmed) {
        return;
    }

    removeLi(li);
};

const filterTasks = ({ target: { value } }) => {
    const text = value.toLowerCase();
    const list = taskList.querySelectorAll("li"); // []

    list.forEach((li) => {
        const liText = li.textContent.trim().toLowerCase();
        li.hidden = !liText.includes(text);
    });
};

const initTasks = () => {
    const tasks = getTasksFromStorage();
    tasks.forEach(appendLi);
};

// Init
initTasks();

// Event listeners
form.addEventListener("submit", addTask);

clearButton.addEventListener("click", clearTasks);

taskList.addEventListener("click", updateTaskList);
taskList.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        updateTaskList(event)
    }
});

filterInput.addEventListener("input", filterTasks);