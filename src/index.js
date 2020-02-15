import "./style/style.scss";

let myId = undefined;

// Listen for form submit

let el = document.getElementById("myForm");
el.addEventListener("submit", saveTask);


refreshTasks();

let tasksId = localStorage.getItem("tasksId");
if (tasksId == undefined) {
    tasksId = -1;
    localStorage.setItem("tasksId", "0");
} else {
    tasksId = parseInt(tasksId);
}

// Save task
function saveTask() {

    // Get form values
    let taskTitle = document.getElementById("title").value;
    let taskDescription = document.getElementById("description").value;
    let tempPrior = document.getElementById("priority");
    let taskPriority = tempPrior.options[tempPrior.selectedIndex].text;
    let taskStatus = "open";

    if (!validateForm(taskTitle)) {
        return false;
    }

    if (myId !== undefined) {
        let tasks = JSON.parse(localStorage.getItem("tasks"));
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].id === myId) {
                tasks[i].title = taskTitle;
                tasks[i].description = taskDescription;
                tasks[i].priority = taskPriority;
            }
        }

        localStorage.setItem("tasks", JSON.stringify(tasks));


    } else {

        let task = {
            id: ++tasksId,
            title: taskTitle,
            description: taskDescription,
            priority: taskPriority,
            status: taskStatus
        }

        // Test if tasks is null
        if (localStorage.getItem("tasks") === null) {
            // Init array
            let tasks = [];
            // Add to array
            tasks.push(task);
            // Set to localStorage
            localStorage.setItem("tasks", JSON.stringify(tasks));
        } else {
            // Get tasks from localStorage
            let tasks = JSON.parse(localStorage.getItem("tasks"));
            // Add task to array
            tasks.push(task);
            // Re-set back to localStorage
            localStorage.setItem("tasks", JSON.stringify(tasks));
        }

        localStorage.setItem("tasksId", tasksId);
    }

    // Clear form
    document.getElementById("myForm").reset();

    // Re-fetch tasks
    refreshTasks();

    // set myId to undefined because reasons
    myId = undefined
}

function createButton(className, iconClassName, buttonFunc, id, spanId) {
    let button = document.createElement("button");
    button.className = "act_button " + className;
    button.addEventListener("click", function () { buttonFunc(id); });
    let i = document.createElement("i");
    i.className = "fa " + iconClassName;
    i.setAttribute("aria-hidden", 'true');
    button.appendChild(i);
    if (spanId != undefined) {
        let span = document.createElement("span");
        span.setAttribute("id", spanId);
        span.append("Done");
        button.appendChild(span);  
    }

    return button;
}

window.refreshTasks = refreshTasks;

function clearContent(elementID) { 
    document.getElementById(elementID).innerHTML = ""; 
} 

// show tasks from localStorage
function refreshTasks() {
    let filters = filterAll();
    console.log('filters = ' + filters+ typeof filters);
    // Get tasks from localStorage
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    console.log("tasks = " + tasks.length);
    // Get output id
    let tasksResults = document.getElementById("tasksResults");
    console.log("tasksResults = " + tasksResults);
    clearContent("tasksResults");

    // Build output
    for (let i = 0; i < tasks.length; ++i) {
        let id = tasks[i].id;
        let title = tasks[i].title;
        let description = tasks[i].description;
        let priority = tasks[i].priority;
        let status = tasks[i].status;

        if ((((tasks[i].title.toLowerCase().indexOf(filters[0]) > -1) || filters[0] === true) && ((tasks[i].status === filters[1]) || filters[1] === true) && ((tasks[i].priority === filters[2]) || filters[2] === true))) {
            let taskItem = document.createElement("div");
            taskItem.setAttribute("id", id);
            taskItem.className = "task_item";
            taskItem.classList.add(status);
            let titleEl = document.createElement("div");
            titleEl.setAttribute("class", "title");
            titleEl.append(title);
            taskItem.appendChild(titleEl);
            let descEl = document.createElement("div");
            descEl.setAttribute("class", "description");
            descEl.append(description);
            taskItem.appendChild(descEl);
            let priorEl = document.createElement("div");
            priorEl.setAttribute("class", "priority");
            priorEl.append(priority);
            taskItem.appendChild(priorEl);
            let buttonsSection = document.createElement("div");
            buttonsSection.className = "action_button";
            buttonsSection.appendChild(createButton("edit_button", "fa-pencil", editTask, id ));
            buttonsSection.appendChild(createButton("done_button", "fa-check", changeStatus, id, `${id}_span_id`));
            buttonsSection.appendChild(createButton("delete_button", "fa-trash", deleteTask, id));
            taskItem.appendChild(buttonsSection);
            tasksResults.appendChild(taskItem);

        }
    }
}

//change status
function changeStatus(id) {
    let doneCard = document.getElementById(id);
    let doneSpan = document.getElementById(`${id}_span_id`);
    // Get tasks from localStorage
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    // Loop through the tasks
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id == id && tasks[i].status == "open") {
            tasks[i].status = "done";
            doneCard.classList.remove("open");
            doneCard.classList.add("done");
            // doneCard.style.backgroundColor = "#e6e6e6";
            // doneSpan.parentElement.style.opacity = "100%";
            //  doneSpan.style.display = "inline-block";
        } else if (tasks[i].id == id && tasks[i].status == "done") {
            tasks[i].status = "open";
            doneCard.classList.remove("done");
            doneCard.classList.add("open");
            // doneCard.style.backgroundColor = "white";
            //  doneSpan.parentElement.style.opacity = "50%";
            //  doneSpan.style.display = "none";
        }
    }
    // Re-set back to localStorage
    localStorage.setItem("tasks", JSON.stringify(tasks));
    // Re-fetch tasks
    //fetchTasks();
}

function findIndex(text, select) {
    let index = 0;
    for (let i = 0; i < select.length; i++) {
        if (select[i].value === text) {
            index = i;
        }
    }
    return index;
}


function editTask(id) {
    myId = id;

    let form = document.getElementById("create_task");
    let select = document.getElementById("priority");
    form.style.display = 'block';
    let taskToEdit = document.getElementById(id);
    let title = taskToEdit.querySelector('.title').innerHTML;
    let description = taskToEdit.querySelector('.description').innerHTML;
    let priority = taskToEdit.querySelector('.priority').innerHTML;
    console.log(title + ' ' + description + ' ' + priority);
    form.querySelector('#title').setAttribute('value', title);
    form.querySelector('#description').innerHTML = description;
    form.querySelector('#priority').selectedIndex = findIndex(priority, select);
}


// // Delete task
function deleteTask(id) {
    // Get tasks from localStorage
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    // Loop through the tasks
    let number = undefined;
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === id) {
            number = i;
            break;
        }
    }
    if (number != undefined) {
        tasks.splice(number, 1);
    }
    // parentElement.parentElement.remove()
    localStorage.setItem("tasks", JSON.stringify(tasks));
    document.getElementById(id).remove();
}
// Re-set back to localStorage




// Validate Form
function validateForm(taskTitle) {
    if (!taskTitle) {
        alert("Please fill in the form");
        return false;
    }
    return true;
}


//search by title
window.searchByTitle = searchByTitle;
function searchByTitle() {
    let input, filter, tasks, task, a, i, txtValue;
    input = document.getElementById("search_field");
    filter = input.value.toLowerCase();
    console.log('input' + filter);
    tasks = document.getElementById("tasksResults");
    task = tasks.getElementsByClassName("task_item");
    for (i = 0; i < task.length; i++) {
        a = task[i].getElementsByClassName("title")[0];
        txtValue = a.textContent || a.innerText;
        if (task[i].style.display !== "none") {
            if (txtValue.toLowerCase().indexOf(filter) > -1) {
                task[i].style.display = "inline-block";
            } else {
                task[i].style.display = "none";
            }
        }
    }
}

//search by priority
window.searchByPriority = searchByPriority;
function searchByPriority() {
    let filter, tasks, task, a, i, txtValue;
    filter = document.getElementById("priority_field").value;
    console.log('input' + filter);
    tasks = document.getElementById("tasksResults");
    task = tasks.getElementsByClassName("task_item");
    if (filter === "all_priorities") {
        for (i = 0; i < task.length; i++) {
            task[i].style.display = "inline-block";
        }
    } else {
        for (i = 0; i < task.length; i++) {
            a = task[i].getElementsByClassName("priority")[0];
            txtValue = a.textContent || a.innerText;
            if (task[i].style.display !== "none") {
                if (txtValue.indexOf(filter) > -1) {
                    task[i].style.display = "inline-block";
                } else {
                    task[i].style.display = "none";
                }
            } 
        }
    }
}


//search by status
window.searchByStatus = searchByStatus;
function searchByStatus() {
    let filter, tasks, task, a = [], i;
    let storageTasks = JSON.parse(localStorage.getItem("tasks"));
    filter = document.getElementById("status_field").value;
    console.log('input' + filter);
    tasks = document.getElementById("tasksResults");
    task = tasks.getElementsByClassName("task_item");
    console.log('length' + task.length);
    if (filter === "all_statuses") {
        for (i = 0; i < task.length; i++) {
            task[i].style.display = "inline-block";
        }
    } else {
        for (i = 0; i < task.length; i++) {
            a[i] = storageTasks[i].status;
            console.log("a[ " + i + " ]= " + a[i]);
            if (task[i].style.display !== "none") {
                if (a[i] === filter) {
                    task[i].style.display = "inline-block";
                } else {
                    task[i].style.display = "none";
                }

            }

        }
    }
}

window.filterAll = filterAll;
function filterAll() {
    let filterTitle, filterStatus, filterPriority, filters;
    filterTitle = document.getElementById("search_field").value.toLowerCase();
    filterStatus = document.getElementById("status_field").value;
    filterPriority = document.getElementById("priority_field").value;
    if (filterTitle == "" ) {filterTitle = true;}
    if (filterPriority === "all_priorities") {filterPriority = true;}
    if (filterStatus === "all_statuses") {filterStatus  = true;}
    filters = [filterTitle,filterStatus, filterPriority];
    return filters;
}