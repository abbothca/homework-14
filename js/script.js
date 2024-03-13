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

const removeTaskFromStorage = (indexOfRemovedLi) => {
    const tasks = getTasksFromStorage();

    // Люба: видаляємо елмент масива з індексом indexOfRemovedLi
    tasks.splice(indexOfRemovedLi, 1);

    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
};

//

// "tasks" functions
const appendLi = (value) => {
    // Create and add LI element
    const li = document.createElement("li");
    li.innerHTML = `${value} <i class="fa fa-remove delete-item"></i>`;
    taskList.append(li);
};

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

const removeTask = (event) => {
    const isDeleteButton = event.target.classList.contains("delete-item");
    if (!isDeleteButton) {
        return;
    }

    const isConfirmed = confirm("Ви впевнені що хочете видалити це завдання?");
    if (!isConfirmed) {
        return;
    }

    const li = event.target.closest("li");
    //Люба: визначаємо порядковий індекс li 
    const indexOfRemovedLi = [...taskList.childNodes].indexOf(li);
    li.remove();

    // Видалити зі сховища 
    // Люба: елемент з індексом
    removeTaskFromStorage(indexOfRemovedLi);
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

taskList.addEventListener("click", removeTask);

filterInput.addEventListener("input", filterTasks);