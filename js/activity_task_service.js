const database = firebase.database();
export function defaultFunction(userKey) {
        let root = database.ref(`/activity_container/${userKey}/activities`);
        root.on('value', (snapshot) => {
            renderActivity(snapshot.val());
        })
}


export function renderActivity(result) {
    if (result != null) {
        let activityHTML = renderActivityHTML(result);
        document.querySelector('.activity-container').innerHTML = activityHTML;
    } else {
        console.log('data is null')
    }
}


export function renderActivityHTML(activities) {
    let activityArray = Object.entries(activities);
    let activitiesHTML = activityArray.reduce((activity, currentValue) => {
        activity += `<div class="activity-box" data-id="${currentValue[0]}">
        <div class="activity-controller">
            <div class="activity-info">
                <p>${currentValue[1].title}</p>
                <div class="task-count">
                    0
                </div>
            </div>
            <button class="add-task">
                <i class="fa fa-plus" aria-hidden="true"></i>
            </button>
        </div>
        <div class="task-container">

        </div>
        </div>`;
        getTaskByActivityKey(currentValue[0]);
        return activity;
    }, '');

    return activitiesHTML;

}

export function addNewActivity(userKey) {
    let activityId = database.ref(`/activity_container/${userKey}/activities/`).push().key;
    let root = database.ref(`/activity_container/${userKey}/activities/`);
    let newActivity = {
        title: "Design the project",
        description: "It have to finish before the review",
        created_at: new Date().toLocaleString()
    };

    root.child(activityId).set(newActivity, (error) => {
        if (error) {
            console.log("// Saving data failed...")
        } else {
            addNewTask(activityId, "Write script for the review day")
            console.log(" // Data saved successfully!")
        }
    });
}
// addNewActivity('-MjiddHxwK9R1FjmeE2w')

export function addNewTask(activityId, taskInput) {
    let root = database.ref('/task_container/' + activityId);

    let newTask = {
        title: taskInput,
        status: false,
        created_at: new Date().toLocaleString(),
        description: ""
    }

    let taskId = root.push().key;

    root.child(taskId).set(newTask, (error) => {
        if (error) {
            console.log("Can not insert task to database - ", error);
        } else {
            // addTask(taskId, newTask);
            console.log(" // Data saved successfully!");
        }
    })
}

// addNewTask('-MjmuZmYRIQmC3a7EnEd', 'Watch Web Dev Simplified ')



export function removeTask(e) {
    const taskBox = e.parentElement;
    let taskId = taskBox.dataset.id;

    database.ref(refName).child(taskId).remove().then(() => {
        taskBox.remove();
        console.log('Delete task succeeded');
    }).catch((errors) => {
        console.log('Delete task failed', errors);
    });
}

export function editTask() {

}

loadActivity('-MjcuetFyUPXo0K0B3fl')

export function loadActivity(activityKey) {
    // getTaskByActivityKey(activityKey).then(result =>{
    //     if(result!= null){
    //         let taskHTML = renderTaskHTML(result);
    //         let activityBox = document.querySelector(`[data-id="${activityKey}"]`);
    //         activityBox.querySelector('.task-container').innerHTML = taskHTML;
    //     }else{
    //         console.log('data is null')
    //     }
    // }).catch(error =>{
    //     console.log('Firebase Error', error)
    // })

}

export function renderTask(result, activityKey) {
    if (result != null) {
        let taskHTML = renderTaskHTML(result, activityKey);
        let activityBox = document.querySelector(`[data-id="${activityKey}"]`);
        activityBox.querySelector('.task-container').innerHTML = taskHTML;
    } else {
        console.log('data is null')
    }
}

export async function getTaskByActivityKey(activityKey) {
    let root = database.ref('/task_container/' + activityKey);
    await root.on('value', (snapshot) => {
        // console.log(snapshot.val())
        renderTask(snapshot.val(), activityKey);
        // result.map((task, index)=>{
        //     console.log(task)
        //     let key = task[0]
        //     console.log(key)
        //     let task_content = task[1]
        //     console.log(task_content.status)
        // })
        // let taskArray = Object.keys(result).map((key) =>[Number(key), result[key]]);
        // console.log(taskArray)
    })
}

export function renderTaskHTML(tasks, activityKey) {
    let taskArray = Object.entries(tasks);
    let taskDone = 0;

    let tasksHTML = taskArray.reduce((task, currentValue) => {
        task += `<div class="task-box" draggable="true" data-id="${currentValue[0]}">
        <div class="task-info">
            <p class="task-title"><i class="fa fa-circle" aria-hidden="true"></i> ${currentValue[1].title}</p>
            <a href="" class="file-attractment"><i class="fa fa-paperclip"
                    aria-hidden="true"></i></a>
        </div>
        <div class="task-content">
            <p>${currentValue[1].description}!</p>
        </div>
        <div class="task-people">
            <div class="people avatar">
                <img src="./assets/images/users/user_4.jpg" alt="">
            </div>
            <div class="people avatar">
                <img src="./assets/images/users/user_5.jpg" alt="">
            </div>
            <div class="people avatar">
                <img src="./assets/images/users/user_6.jpg" alt="">
            </div>
        </div>
    </div>`;
        if (currentValue[1].status) taskDone++;
        return task;
    }, '');

    let activityBox = document.querySelector(`[data-id="${activityKey}"]`);
    activityBox.querySelector('.task-count').textContent = `${taskDone}/${taskArray.length}`;

    return tasksHTML;

}

export function addTask(taskId, newTask) {
    let taskBox = document.createElement('div');
    taskBox.classList.add('task-box');
    taskBox.dataset.id = taskId;

    let taskContent = document.createElement('p');
    taskContent.classList.add('content');
    taskContent.textContent = newTask.title;

    let taskRemoveBtn = document.createElement('button');
    taskRemoveBtn.type = "button";
    taskRemoveBtn.innerHTML = "Remove";
    taskRemoveBtn.addEventListener('click', () => {
        removeTask(taskRemoveBtn);
    });

    taskBox.appendChild(taskContent);
    taskBox.appendChild(taskRemoveBtn);

    activityBox.appendChild(taskBox);
    taskInput.value = "";
}

// getTaskByActivityKey('-MjcuetFyUPXo0K0B3fl');