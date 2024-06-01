
const loginButton = document.getElementById("login-btn");
const registerButton = document.getElementById("register-btn");
const registerMessage = document.getElementById("register-message");
const loginMessage = document.getElementById("login-message");

const registerUsernameInput = document.getElementById("register-username");
const registerPasswordInput = document.getElementById("register-password");
const loginUsernameInput = document.getElementById("login-username")
const loginPasswordInput = document.getElementById("login-password")
loginButton.addEventListener("click", handleLogin);
registerButton.addEventListener("click", handleRegister);

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

    console.log("Login clicked")

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
            console.log("Login succeeded");
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

    console.log("Register clicked");

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
            console.log("Register succeeded");
        })
        .catch(error => {
            document.getElementById("register-message").textContent = error.message;
            registerMessage.style.visibility = "visible";
            console.error('Error:', error);
        });
}


