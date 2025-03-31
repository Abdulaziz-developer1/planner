const dateSwiper = document.getElementById("dateSwiper");
const taskList = document.getElementById("taskList");
const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTask");
const progressBar = document.getElementById("progress");
const completionText = document.getElementById("completionText");
const selectedDateElement = document.getElementById("selectedDate");

const DEFAULT_TASKS = ["doing course homework", "doing homework", "training", "balling"];
let tasksData = getFromLocalStorage("tasks") || {};
let currentDate = getTodayDate();

function getTodayDate() {
    let today = new Date();
    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, "0");
    let day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function generateDates() {
    for (let i = 0; i < 365; i++) {
        let date = new Date(2025, 0, 1);
        date.setDate(date.getDate() + i);
        let formattedDate = date.toISOString().split("T")[0];

        let slide = document.createElement("div");
        slide.classList.add("swiper-slide");
        slide.textContent = formattedDate;
        slide.dataset.date = formattedDate;

        slide.addEventListener("click", function () {
            currentDate = this.dataset.date;
            updateTasks();
        });

        dateSwiper.appendChild(slide);
    }
}

function updateTasks() {
    selectedDateElement.textContent = currentDate;

    if (!tasksData[currentDate]) {
        tasksData[currentDate] = DEFAULT_TASKS.map(task => ({ name: task, done: false }));
    }

    renderTasks();
    saveToLocalStorage("tasks", tasksData);
}

function renderTasks() {
    taskList.innerHTML = "";
    let completedTasks = 0;

    tasksData[currentDate].forEach((task, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <input type="checkbox" ${task.done ? "checked" : ""} onchange="toggleTask(${index})">
            ${task.name}
            <button onclick="deleteTask(${index})">X</button>
        `;
        taskList.appendChild(li);
        if (task.done) completedTasks++;
    });

    let completionPercent = (completedTasks / tasksData[currentDate].length) * 100;
    progressBar.style.width = completionPercent + "%";
    completionText.textContent = completionPercent === 100 ? "Perfect" : "";
}

function addTask() {
    const newTask = taskInput.value.trim();
    if (newTask) {
        tasksData[currentDate].push({ name: newTask, done: false });
        taskInput.value = "";
        updateTasks();
    }
}

function deleteTask(index) {
    tasksData[currentDate].splice(index, 1);
    updateTasks();
}

function toggleTask(index) {
    tasksData[currentDate][index].done = !tasksData[currentDate][index].done;
    updateTasks();
}

addTaskButton.addEventListener("click", addTask);

document.addEventListener("DOMContentLoaded", function () {
    generateDates();
    currentDate = getTodayDate();
    updateTasks();

    setTimeout(() => {
        // Get today's index correctly
        const todayIndex = Array.from(dateSwiper.children).findIndex(slide => slide.dataset.date === currentDate);
        console.log("Formatted Today's Date:", currentDate);
        console.log("Today's Index:", todayIndex);

        // Initialize Swiper without centeredSlides
        const swiper = new Swiper('.swiper-container', {
            slidesPerView: 5,
            spaceBetween: 10,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            centeredSlides: false,
            initialSlide: todayIndex,  // Set the initial slide directly
        });

        // After initialization, manually slide to today's date if needed
        swiper.on('init', () => {
            if (todayIndex >= 0) {
                swiper.slideTo(todayIndex, 0);
                console.log("Swiper manually set to today's date:", todayIndex);
            }
        });

        // Force update to ensure the swiper displays correctly
        swiper.update();
    }, 100);
});
