const registerContainer = document.querySelector('.register-container');
const loginContainer = document.querySelector('.login-container');

function showRegisterForm() {
    registerContainer.classList.add('active');
    loginContainer.classList.add('active');
}

function showLoginForm() {
    loginContainer.classList.remove('active');
    registerContainer.classList.remove('active');
}

var counter = 1;
setInterval(function () {
    document.getElementById('radio' + counter).checked = true;
    counter++;
    if (counter > 3) {
        counter = 1;
    }
}, 5000);