import modal, { swalAlert, redirectAlert, singleAlert} from './modal.js';
// singleAlert(icon, title, text)

const database = firebase.database();

const registerContainer = document.querySelector('.register-container');
const loginContainer = document.querySelector('.login-container');
const showRegisterFormBtn = document.querySelector('.go-register-form');
const showLoginFormBtn = document.querySelector('.go-login-form');

// Switch event between login and register form
showLoginFormBtn.addEventListener('click', showLoginForm);
showRegisterFormBtn.addEventListener('click', showRegisterForm);

function showRegisterForm() {
    registerContainer.classList.add('active');
    loginContainer.classList.add('active');
}

function showLoginForm() {
    loginContainer.classList.remove('active');
    registerContainer.classList.remove('active');
}

// Auto slider photos
var counter = 1;
setInterval(function () {
    document.getElementById('radio' + counter).checked = true;
    counter++;
    if (counter > 3) {
        counter = 1;
    }
}, 3000);

const registerGoogleBtn = document.querySelector('.google-register');

registerGoogleBtn.addEventListener("click", function () {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then((result) => {
        let user = result.user;
        var credential = result.credential;
        let newUser = { email: '', phone: '', name: '', photoURL: '' , status: false};
        if (user != null) {
            newUser.email = user.email;
            newUser.name = user.displayName;
            newUser.photoURL = user.photoURL;
            newUser.phone = user.userPhone == "" ? user.userPhone : "";
            saveUserInfo(newUser);
        } else {
            singleAlert('warning', 'Can not get any data', "Don't have user data to save to database")
        }
        // console.log(credential)
        // console.log("accessToken", credential.accessToken)
        // console.log("idToken", credential.idToken)
    }, (error) => {
        console.log("error", error.credential)
    });
});

function saveUserInfo(newUser) {
    isEmailExist(newUser.email)
        .then(result => {
            // Saving user data if email address haven't been use
            console.log(result)
            if (!result && result != undefined) {
                let autoId = database.ref('/users').push().key;
                let data = {};
                data['/users/' + autoId] = newUser;
                data['/emails/' + autoId] = { email: newUser.email };
                database.ref().update(data).then(() => {
                    saveInfoLocal(newUser.email);
                    redirectAlert(modal.MODAL_CONTENT.redirect_create_user_success)
                }).catch((error) => {
                    swalAlert(modal.MODAL_CONTENT.create_user_failed)
                })

                // Another way to saving data
                // database.ref('/users').child(autoId).set(newUser, (error) => {
                //     if (error) console.log(error);
                //     else {
                //         console.log("User info saved successfully!")
                //     }
                // })
                // database.ref('/emails').child(autoId).set({ mail: newUser.email });
            }
            // Show notification if the email address already in use
            else {
                swalAlert(modal.MODAL_CONTENT.exist_mail_error);
            }
        })
        .catch(error => console.log(error));
}

async function isEmailExist(email) {
    let isExist = true;
    let result = database.ref('/emails').orderByChild('email').equalTo(email).limitToFirst(1);
    await result.once('value', (snapshot) => {
        // console.log(snapshot.val())
        
        // != null: data is exist
        if (snapshot.val() == null) isExist = false;
    })
    return isExist;
}

// Saving email user to local storage
function saveInfoLocal(email) {
    localStorage.setItem('email', email);
}

// LOADING ANIMATION
const loadingAnimation = document.querySelector('.loading-container');

function showLoading(){
    loadingAnimation.classList.remove('hidden');
}
function hideLoading(){
    loadingAnimation.classList.add('hidden');
}

// ANOTHER FUNCTIONS


function removeUser(keyId) {
    database.ref('/users').child(keyId).remove();
    database.ref('/emails').child(keyId).remove();
}

function getUserInfo() {
    let user;
    let result = database.ref("/users").orderByChild('email').equalTo("thaisonbk1.4@gmail.com");
    result.once('value', (snapshot) => {
        user = snapshot.val();
        let userInfo = Object.values(user);
        // console.log(userInfo[0].email);
        // Getting userKey by email 
        userKey = Object.keys(user)[0]; // userKey is the first key name of the object
        console.table(userKey)
        if (userKey != "") {
            // addNewActivity()
        } else {
            console.log("Not found userKey")
        }
    })
}

function addDays(toDay, days) {
    let now = new Date(toDay.valueOf());
    now.setDate(toDay.getDate() + days);
    return now.toUTCString();
}

function saveInfoCookie(email) {
    document.cookie = `email=${email}; expires= ${addDays(new Date(), 10)}`;
}

function checkInfoCookie() {
    // similar behavior as an HTTP redirect
    // window.location.replace("http://stackoverflow.com");

    // similar behavior as clicking on a link
    window.location.href = './login.html';

    // Jquery
    // $(location).attr('href', 'url');
}
