// HTML button elements
const loginButton = document.getElementById("login-btn");
const logoutButton = document.getElementById("logout-btn")
const registerButton = document.getElementById("register-btn");

// HTML message elements display above the username
const registerMessage = document.getElementById("register-message");
const loginMessage = document.getElementById("login-message");

// HTML inputbox elements which allow user to enter the username and password
const registerUsernameInput = document.getElementById("register-username");
const registerPasswordInput = document.getElementById("register-password");
const loginUsernameInput = document.getElementById("login-username")
const loginPasswordInput = document.getElementById("login-password")

// HTML button elemetns in the testing field, which allow user to do bypassing injection
// Blind injection and check password
const bypassInjectionButton = document.getElementById("bypassing-injection-btn");
const blindInjectionButton = document.getElementById("blind-injection-btn")
const changePasswordButton = document.getElementById("change-password")

// Default timeout, 5 second
const DEFAULT_TIMEOUT = 5000;

// Eventlistener for button got clicked
loginButton.addEventListener("click", handleLogin);
logoutButton.addEventListener("click", handleLogout);
registerButton.addEventListener("click", handleRegister);
bypassInjectionButton.addEventListener("click", handleBypassInjection);
blindInjectionButton.addEventListener("click", handleBlindInjection);
changePasswordButton.addEventListener("click", handlePasswordChange);

// Eventlistener to hide the message when inputbox value change
registerUsernameInput.addEventListener("input", hideRegisterMessage);
registerPasswordInput.addEventListener("input", hideRegisterMessage);
loginUsernameInput.addEventListener("input", hideLoginMessage);
loginPasswordInput.addEventListener("input", hideLoginMessage);

// OWASP API Security Top 10 API4:2023 Unrestricted Resource Consumption
// Set timeout to control the Execution timeouts to prevent overuse of resource consumption
function fetchWithTimeout(url, options = {}, timeout = DEFAULT_TIMEOUT) {
    // Return a new Promise that will handle the timeout and fetch logic.
    return new Promise((resolve, reject) => {
        // Create a new AbortController instance to control the fetch request's lifetime.
        const controller = new AbortController();
        // Extract the signal property from the controller, which will be used to abort the fetch request.
        const { signal } = controller;

        // Attach the signal to the fetch options so it can be used to abort the request if necessary.
        options.signal = signal;

        // Set a timeout to abort the fetch request if it takes longer than the specified timeout duration.
        const timeoutId = setTimeout(() => {
            controller.abort();
            reject(new Error('Request timed out'));
        }, timeout);

        // Perform the fetch request with the given URL and options.
        fetch(url, options)
            .then(response => {
                // Clear the timeout if the fetch request completes successfully.
                clearTimeout(timeoutId);
                // Resolve the Promise with the response from the fetch request.
                resolve(response);
            })
            .catch(err => {
                // Clear the timeout if an error occurs during the fetch request.
                clearTimeout(timeoutId);
                // Reject the Promise with the error that occurred.
                reject(err);
            });
    });
}

function globalFetch(url, options = {}, timeout = DEFAULT_TIMEOUT) {
    return fetchWithTimeout(url, options, timeout);
}

// Hide the message of register if inputbox of username or password changed
function hideRegisterMessage() {
    registerMessage.style.visibility = "hidden";
}

// Hide the message of login if inputbox of username or password changed
function hideLoginMessage() {
    loginMessage.style.visibility = "hidden";
}

// Function to handle the login
function handleLogin() {
    // Get the username and password value from the inputbox
    const username = loginUsernameInput.value;
    const password = loginPasswordInput.value;

    // Perform the login fetch request
    globalFetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
        .then(response => {
            // Check if the response status indicates a failure.
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.message);
                });
            }
            // If the response is OK, parse the response body as JSON.
            return response.json();
        })
        .then(data => {
            // Display the message in HTML element
            document.getElementById("login-message").textContent = data.message;
            document.getElementById("login-message").style.visibility = "visible";
        })
        .catch(error => {
            // Display the error in HTML element
            document.getElementById("login-message").textContent = error.message;
            document.getElementById("login-message").style.visibility = "visible";
            console.error('Error:', error);
        });
}

// Function to handle the register
function handleRegister() {
    // Get the username and password value from the inputbox
    const username = registerUsernameInput.value;
    const password = registerPasswordInput.value;

    // Perform the register fetch request
    globalFetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
        .then(response => {
            // Check if the response status indicates a failure.
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.message);
                });
            }
            // If the response is OK, parse the response body as JSON.
            return response.json();
        })
        .then(data => {
            // Display the message in HTML element
            document.getElementById("register-message").textContent = data.message;
            document.getElementById("register-message").style.visibility = "visible";
            registerMessage.style.visibility = "visible";
        })
        .catch(error => {
            // Display the error in HTML element
            document.getElementById("register-message").textContent = error.message;
            document.getElementById("register-message").style.visibility = "visible";
            console.error('Error:', error);
        });
}

// Sample Bypass Injection Attack
function handleBypassInjection() {
    // The injection will use the "' OR '1'='1" we discussed in class with no password to login user
    const username = "' OR '1'='1";
    const password = "anything";
    const type = "bypass"

    performLogin(username, password, type)
}

// Sample Blind Injection Attack
function handleBlindInjection() {
    // The injection will target the admin account if exist one with no password to login the admin
    const username = "admin"
    const password = "anything";
    const type = "blind"

    performLogin(username, password, type);
}

// Help method to perform login
function performLogin(username, password, type) {
    // Call the globalFetch function with the URL for the login endpoint and the request options.
    globalFetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        // Convert the username, password, and type parameters to a JSON string and set it as the request body.
        body: JSON.stringify({ username, password, type })
    })
        .then(response => {
            console.log('Response status:', response.status);
            // Check if the response status indicates a failure.
            if (!response.ok) {
                // If the response is not OK, parse the response body as JSON and handle the error.
                return response.json().then(data => {
                    console.log('Response data:', data);
                    throw new Error(data.message);
                });
            }
            // If the response is OK, parse the response body as JSON.
            return response.json();
        })
        .then(data => {
            console.log('Successful response:', data);
            // Display the message in HTML element
            document.getElementById("testing-message").textContent = data.message;
            document.getElementById("testing-message").style.visibility = "visible";
        })
        .catch(error => {
            console.error('Error:', error);
            // Display the error in HTML element
            document.getElementById("testing-message").textContent = error.message;
            document.getElementById("testing-message").style.visibility = "visible";
        });
}

// Function to handle the password change
function handlePasswordChange() {
    // Get the username and password value from the inputbox
    const username = loginUsernameInput.value;
    const password = loginPasswordInput.value;

    // Call the globalFetch function with the URL for the login endpoint and the request options.
    globalFetch('http://localhost:3000/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
        .then(response => response.json().then(data => {
            // Check if the response is not OK, if the request failed and no message.
            // Will display the default message as Password change failed
            if (!response.ok) {
                throw new Error(data.message || 'Password change failed');
            }
            return data;
        }))
        .then(data => {
            // Display the message in HTML element
            document.getElementById("testing-message").textContent = data.message;
            document.getElementById("testing-message").style.visibility = "visible";
        })
        .catch(error => {
            console.error('Error:', error);
            // Display the error in HTML element
            document.getElementById("testing-message").textContent = error.message;
            document.getElementById("testing-message").style.visibility = "visible";
        });
}

// Function to handle the logout
function handleLogout() {
    // Call the globalFetch function with the URL for the login endpoint and the request options.
    globalFetch('http://localhost:3000/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    })
        .then(response => response.json().then(data => {
            // Check if the response is not OK, if the request failed and no message.
            // Will display the default message as Logout failed
            if (!response.ok) {
                throw new Error(data.message || 'Logout failed');
            }
            return data;
        }))
        .then(data => {
            // Display the message in HTML element
            document.getElementById("login-message").textContent = data.message;
            document.getElementById("login-message").style.visibility = "visible";
        })
        .catch(error => {
            console.error('Error:', error);
            // Display the error in HTML element
            document.getElementById("login-message").textContent = error.message;
            document.getElementById("login-message").style.visibility = "visible";
        });
}
