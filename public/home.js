const loginButton = document.getElementById("login-btn");
const registerButton = document.getElementById("register-btn");
const registerMessage = document.getElementById("register-message");
const loginMessage = document.getElementById("login-message");

const registerUsernameInput = document.getElementById("register-username");
const registerPasswordInput = document.getElementById("register-password");
const loginUsernameInput = document.getElementById("login-username")
const loginPasswordInput = document.getElementById("login-password")

const bypassInjectionButton = document.getElementById("bypassing-injection-btn");
const blindInjectionButton = document.getElementById("blind-injection-btn")
const errorbasedInjectionButton = document.getElementById("error-injection-btn")

loginButton.addEventListener("click", handleLogin);
registerButton.addEventListener("click", handleRegister);
bypassInjectionButton.addEventListener("click", handleBypassInjection);
blindInjectionButton.addEventListener("click", handleBlindInjection);
errorbasedInjectionButton.addEventListener("click", handleErrorbasedInjection);

registerUsernameInput.addEventListener("input", hideRegisterMessage);
registerPasswordInput.addEventListener("input", hideRegisterMessage);
loginUsernameInput.addEventListener("input", hideLoginMessage);
loginPasswordInput.addEventListener("input", hideLoginMessage);

function hideRegisterMessage() {
    registerMessage.style.visibility = "hidden";
}

function hideLoginMessage() {
    loginMessage.style.visibility = "hidden";
}

function handleLogin() {
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.message);
                });
            }
            return response.json();
        })
        .then(data => {
            document.getElementById("login-message").textContent = data.message;
            loginMessage.style.visibility = "visible";
        })
        .catch(error => {
            document.getElementById("login-message").textContent = error.message;
            loginMessage.style.visibility = "visible";
            console.error('Error:', error);
        });
}

function handleRegister() {
    const username = document.getElementById("register-username").value;
    const password = document.getElementById("register-password").value;

    fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.message);
                });
            }
            return response.json();
        })
        .then(data => {
            document.getElementById("register-message").textContent = data.message;
            registerMessage.style.visibility = "visible";
            //console.log("Register successfully");
        })
        .catch(error => {
            document.getElementById("register-message").textContent = error.message;
            registerMessage.style.visibility = "visible";
            console.error('Error:', error);
        });
}

// Sample Bypass Injection Attack
function handleBypassInjection() {
    const username = "' OR '1'='1";
    const password = "anything";
    const type = "bypass"

    performLogin(username, password, type)
}

// Sample Blind Injection Attack
function handleBlindInjection() {
    //const username = "1' OR 1=1 --";
    const username = "admin"
    const password = "anything";
    const type = "blind"

    performLogin(username, password, type);
}

// Sample Error-based Injection Attack
function handleErrorbasedInjection() {
    const username = "admin";
    const password = "anything";
    const type = "error-based";

    performLogin(username, password, type);
}

// Help method to perform login
function performLogin(username, password, type) {
    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password, type })
    })
        .then(response => {
            console.log('Response status:', response.status);
            if (!response.ok) {
                return response.json().then(data => {
                    console.log('Response data:', data);
                    throw new Error(data.message);
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Successful response:', data);
            document.getElementById("testing-message").textContent = data.message;
            document.getElementById("testing-message").style.visibility = "visible";
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById("testing-message").textContent = error.message;
            document.getElementById("testing-message").style.visibility = "visible";
        });
}