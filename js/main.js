import modal, { swalAlert, redirectAlert, singleAlert} from './modal.js';
// singleAlert(icon, title, text)

// LOADING ANIMATION
const loadingAnimation = document.querySelector('.loading-container');
function showLoading(){
    loadingAnimation.classList.remove('hidden');
}
function hideLoading(){
    loadingAnimation.classList.add('hidden');
}

var userKey = '';

const database = firebase.database();

// Check user already login or not
window.onload = function(){
    showLoading();
    let email = localStorage.getItem('email');
    // redirect user to login page if local storage don't have any email value
    if(email == "") redirectAlert(modal.MODAL_CONTENT.redirect_permission);
    else{
        getUserInfo(email).then(result =>{
            userKey = result;
            // Checking userKey
            if(userKey != ''){
                swalAlert(modal.MODAL_CONTENT.get_success)
                getUserByKey(userKey).then(user =>{
                    let userInfo = user;
                }).catch(error2 =>{
                    swalAlert(modal.MODAL_CONTENT.get_error)
                })
            }else{
                redirectAlert(modal.MODAL_CONTENT.redirect_valid_email);
            }
        }).catch(error =>{
            singleAlert('error', 'Firebase Error', error);
        });
    }
    hideLoading()
}

async function getUserInfo(email) {
    let user;
    let result = database.ref("/users").orderByChild('email').equalTo(email);
    await result.once('value', (snapshot) => {
        user = snapshot.val();
        let userInfo = Object.values(user);
        // console.log(userInfo[0].email); // get email
        // Getting userKey by email 
        userKey = Object.keys(user)[0]; // userKey is the first key name of the object
    })
    return userKey;
}

async function getUserByKey(userKey){
    let userInfo;
    await database.ref('/users').child(userKey).once('value', (user)=>{
        userInfo = user.val();
    })
    return userInfo;
}

// Declare the task drop here
const taskDrop = document.createElement('p');
taskDrop.classList.add('task-drop');
taskDrop.innerHTML = "Drop here";

const impLinks = document.querySelectorAll('.shortcut-links .imp-link');
const barAnimation = document.querySelector('.bar-animation');

// Sidebar selection
impLinks.forEach(impLink => {
    impLink.addEventListener('click', () => {
        // Remove all selected element
        for (let i = 0; i < impLinks.length; i++) {
            impLinks[i].classList.remove('selected');
        }
        impLink.classList.add('selected');
        let position = parseInt(impLink.dataset.position);
        // total = margin + option height - 4
        barAnimation.style.top = ((-4) * position + (22 + 36) * position) + "px";
    })
})

const taskContainers = document.querySelectorAll('.task-container');
const taskBoxes = document.querySelectorAll('.task-box');

taskBoxes.forEach(taskBox => {
    taskBox.addEventListener('dragstart', () => {
        taskBox.classList.add('task-dragging');
    })
    taskBox.addEventListener('dragend', () => {
        taskBox.classList.remove('task-dragging');
    })
})


taskContainers.forEach(taskContainer => {
    taskContainer.addEventListener('dragover', (e) => {
        taskDrop.style.display = 'block';
        e.preventDefault();
        const afterElement = getDraggingAfterElement(taskContainer, e.clientY)
        const taskDragging = document.querySelector('.task-dragging');
        if (afterElement == null) {
            // activityBox.appendChild(taskDragging)
            taskContainer.appendChild(taskDrop);
        } else {
            // activityBox.appendChild(taskDrop);
            taskContainer.insertBefore(taskDrop, afterElement);
        }
    })

    taskContainer.addEventListener('dragend', () => {
        taskDrop.style.display = 'none';
    })
})

function getDraggingAfterElement(taskContainer, y) {
    // [...]: convert to a new array
    const taskElements = [...taskContainer.querySelectorAll('.task-box:not(task-dragging)')];
    // console.log(taskElements)
    return taskElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child }
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element
}

// SIDEBAR SHOW/HIDE CONTROLLER
const sidebarToggleBtn = document.querySelector('.toggle-sidebar');
const sidebar = document.querySelector('.sidebar');
const mainContent = document.querySelector('.content');

sidebarToggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('minimize');
    mainContent.classList.toggle('maximize');

    if(localStorage.getItem("sidebar") == "minimize"){
        localStorage.setItem("sidebar", "maximize");
    }else{
        localStorage.setItem("sidebar", "minimize");
    }
})

// READ AND SET SIDEBAR MODE BY LOCAL STORAGE DATA
if (localStorage.getItem("sidebar") == "minimize") {
    sidebar.classList.add("minimize");
    mainContent.classList.add('maximize');
}
else if (localStorage.getItem("sidebar") == "dark") {
    sidebar.classList.remove("minimize");
    mainContent.classList.remove("maximize");
} else {
    // Maximize is default sidebar mode
    localStorage.setItem("sidebar", "maximize");
}
