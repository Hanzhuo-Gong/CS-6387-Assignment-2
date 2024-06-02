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
const changePasswordButton = document.getElementById("change-password")

loginButton.addEventListener("click", handleLogin);
registerButton.addEventListener("click", handleRegister);
bypassInjectionButton.addEventListener("click", handleBypassInjection);
blindInjectionButton.addEventListener("click", handleBlindInjection);
changePasswordButton.addEventListener("click", handlePasswordChange);

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
    const username = loginUsernameInput.value;
    const password = loginPasswordInput.value;

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
    const username = registerUsernameInput.value;
    const password = registerPasswordInput.value;

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

function handlePasswordChange() {
    const username = loginUsernameInput.value; // Admin username
    const password = loginPasswordInput.value; // Admin password

    fetch('http://localhost:3000/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
        .then(response => response.json().then(data => {
            if (!response.ok) {
                throw new Error(data.message || 'Password change failed');
            }
            return data;
        }))
        .then(data => {
            document.getElementById("testing-message").textContent = data.message;
            document.getElementById("testing-message").style.visibility = "visible";
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById("testing-message").textContent = error.message;
            document.getElementById("testing-message").style.visibility = "visible";
        });
}