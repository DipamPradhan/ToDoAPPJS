const addTaskButton = document.getElementById('addTask');
let taskArray = [];
const todoList = document.getElementById("todoList");
const toastBox = document.getElementById("toastBox");

const success = "Task Added Successfully";
const invalid = "Invalid Empty Entry!";
const deleted = "Task Deleted Successfully";
const edited = "Task Edited Successfully";
if(taskArray.length==0){
    const empty = document.createElement("p");
    empty.textContent="No Task Added Yet!";
    empty.classList.add("empty");
    todoList.append(empty);
}
addTaskButton.addEventListener('click',function(event){
    event.preventDefault();
    const inputTask = document.getElementById("task").value;
    const taskText = inputTask.trim();
    let isValid = false;
    if(taskText==""){
        showToast(invalid);
    }else{
        isValid = true;
        showToast(success);
    }
    if(isValid){
        let date = new Date();
        
        taskArray.unshift({
        text:taskText,
        completed: false,
        createdDate: date.toDateString(),
        createdTime: date.toLocaleTimeString()
    });

    sortTasks();
    displayTasks();
   
}
    document.getElementById("task").value = "";

});

let filterArray = taskArray;

function toggleTask(index,filterArray,filterMode){
    filterArray[index].completed = !filterArray[index].completed;
    sortTasks();
    displayTasks(filterMode);
}
function sortTasks(){
    taskArray.sort((a,b)=>a.completed-b.completed);
}



function displayTasks(filterMode=null){
    todoList.innerHTML = "";

    if(filterMode==null){
        filterArray = taskArray;
    }else if(filterMode===true){
        filterArray = taskArray.filter(task => task.completed);
    }else if(filterMode===false){
        filterArray = taskArray.filter(task=> !task.completed);
    }
    const empty = document.createElement("p");
    empty.classList.add("empty");
    todoList.append(empty);
    if(filterArray.length==0&&filterMode==null){
        empty.textContent = "No Task Added Yet!";
    }else if(filterArray.length==0&&filterMode==true){
        empty.innerHTML = "No Task Completed Yet!";
    }else if(filterArray.length==0&&filterMode==false){
        empty.textContent = "No Task Pending!";
    }

    filterArray.forEach((task,index)=>{
        const listData = document.createElement("div");
        listData.classList.add("listData");
        const taskDivText = document.createElement("textarea");

        const actionDiv = document.createElement("div");
        const editTask = document.createElement("button");
        const deleteTask = document.createElement("button");
        const updatedDivDate = document.createElement("div");
        const updatedDivTime = document.createElement("div");
        editTask.textContent = "Edit";
        deleteTask.textContent = "Delete"; 

        taskDivText.classList.add("taskName");

   
        if(task.completed){
            taskDivText.classList.add("completed");
            listData.classList.add("completed");
            editTask.disabled = true;
            editTask.classList.add("noChange");
        }
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change",function(e){
            e.preventDefault();
            toggleTask(index,filterArray,filterMode);
            let msg;
            if(checkbox.checked){
            msg = `"${task.text}" Task is Finished`;
            }else{
            msg = `"${task.text}" Task is Not Completed`;
            }
            showToast(msg);
        })

        taskDivText.value = task.text;
        taskDivText.disabled = true;
        updatedDivDate.textContent = task.createdDate;
        updatedDivTime.textContent = task.createdTime;

        updatedDivDate.classList.add("updatedDate");
        updatedDivTime.classList.add("updatedTime");
        editTask.classList.add("editTask");
        deleteTask.classList.add("deleteTask");
        actionDiv.classList.add("action");

        editTask.addEventListener("click",function(e){
            let updatedVal = new Date();
            e.preventDefault();
            if(taskDivText.disabled){
                taskDivText.disabled = false;
                editTask.textContent = "Update";
                editTask.classList.add("updateTask");
                taskDivText.style.border = "2px solid black";
                taskDivText.focus();
            }else{
                taskDivText.disabled = true;
                if(taskDivText.value==""&&taskDivText.value.trim()==""){
                    showToast(invalid);
                    return;
                }
                editTask.textContent = "Edit";
                task.text=taskDivText.value;
                editTask.classList.remove("updateTask");
                taskDivText.style.border = "none";
                task.createdDate = updatedVal.toDateString();
                task.createdTime = updatedVal.toLocaleTimeString();
                updatedDivDate.textContent = task.createdDate;
                updatedDivTime.textContent = task.createdTime;
                showToast(edited);
                
            }
        })

        deleteTask.addEventListener("click", function (e) {
            const yesBtn = document.getElementById("yes");
            const noBtn = document.getElementById("no");

            showPopup();
            e.preventDefault();
        
            yesBtn.onclick = function () {
                const dataText = filterArray[index].text;
                const dataCompleted = filterArray[index].completed;
                const indexToDelete = taskArray.findIndex(
                    task=>task.text===dataText
                    &&
                    task.completed===dataCompleted
                );
                taskArray.splice(indexToDelete,1);
                displayTasks(filterMode);  
                hidePopup();  
                showToast(deleted);  
                // if (taskArray.length == 0) {
                //     const empty = document.createElement("p");
                //     empty.innerHTML = "No Task Added Yet!";
                //     empty.classList.add("empty");
                //     todoList.append(empty);
                // }
            };
        
            noBtn.onclick = function (e) {
                e.preventDefault();
                hidePopup();  
            };
        

        });


        actionDiv.append(editTask,deleteTask);

        listData.append(checkbox,taskDivText,updatedDivDate,updatedDivTime,actionDiv);
        todoList.append(listData);
    });
}

function showToast(msg){
    const toast = document.createElement("div");
    toast.classList.add("toast");
    toast.innerHTML = msg;
    toastBox.append(toast);
    if(msg.includes("Invalid")){
        toast.classList.add("invalid");
    }
    if(msg.includes("Deleted")||msg.includes("Not Completed")){
        toast.classList.add("deleted");
    }
    if(msg.includes("Edited")){
        toast.classList.add("edited");
    }
    if(msg.includes("Finished")){
        toast.classList.add("completion");
    }

    setTimeout(()=>{
        toast.remove();
    },3000);
}

const popUp = document.getElementById("popupOverlay");

function showPopup() {
    popUp.style.display = "flex";
}


function hidePopup() {
    popUp.style.display = "none";
}


const filter = document.getElementById("filterSelect");
filter.addEventListener("change", function () {
    const filterValue = filter.value;
    if (filterValue==1) {
        displayTasks(null); 
    } else if (filterValue == 2) {
        displayTasks(true);
    } else if (filterValue == 3) {
        displayTasks(false);
    }else{
        displayTasks(null);
    }
});