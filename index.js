const taskListEl = document.getElementById("tasks");
const taskAddEl = document.getElementById("add-task");
const taskList = JSON.parse(localStorage.getItem("taskList")) || [];
const resetBtn = document.getElementById("reset");

taskList != [] && renderTaskEls(taskList);

function randomID() {
    var S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return S4() + S4() + "-" + S4();
}

resetBtn.addEventListener("click", function () {
    if (confirm("This will delete all your tasks!")) {
        console.log("ok");
        taskList.length = 0;
        localStorage.removeItem("taskList");
        taskListEl.innerHTML = "";
    }
});

function setCheckboxHandlers() {
    const taskCheckboxes = document.querySelectorAll(".task input");
    taskCheckboxes.forEach((taskCheckbox) => {
        taskCheckbox.addEventListener("click", function () {
            const taskid = this.dataset.taskid;
            const index = taskList.map((task) => task.id).indexOf(taskid);
            taskList[index] = {
                ...taskList[index],
                state: this.checked,
            };
            taskList.sort(function (a, b) {
                return a.state === b.state ? 0 : a.state ? 1 : -1;
            });
            renderTaskEls(taskList);
        });
    });
}

setCheckboxHandlers();

document.addEventListener("keydown", function (event) {
    if (event.key != "Tab") {
        taskAddEl.focus();
    }
});

taskAddEl.addEventListener("keyup", function (event) {
    if (event.key == "Enter" && taskAddEl.value.trim()) {
        const taskObj = {
            id: randomID(),
            value: taskAddEl.value,
            state: false,
        };
        taskList.unshift(taskObj);

        renderTaskEls(taskList);
        taskAddEl.value = "";
    }
});

function setDeleteHandlers() {
    const deleteBtns = document.querySelectorAll(".delete");
    deleteBtns.forEach((deleteBtn) => {
        deleteBtn.addEventListener("click", function () {
            const taskid = this.dataset.taskid;
            const index = taskList.map((task) => task.id).indexOf(taskid);
            taskList.splice(index, 1);
            renderTaskEls(taskList);
        });
    });
}

function renderTaskEls(taskList) {
    localStorage.setItem("taskList", JSON.stringify(taskList));
    taskEls = taskList
        .map((task) => {
            return `<div class="task"><input type="checkbox" id="task_${
                task.id
            }" data-taskid="${task.id}" ${
                task.state ? "checked" : ""
            } /><label for="task_${task.id}">${
                task.value
            }</label><input type="button" class="delete" value="×" data-taskid="${
                task.id
            }" /></div>`;
        })
        .join("");
    taskListEl.innerHTML = taskEls;
    setCheckboxHandlers();
    setDeleteHandlers();
}
