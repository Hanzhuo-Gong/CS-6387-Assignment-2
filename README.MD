# CS 6387 Assignment 2 - Secure Programming
## Project Description
This project is a demonstration of SQL Injection vulnerabilities and how to mitigate them. The application is built using a simple Node.js backend with an in-memory SQLite database and a front-end using HTML, CSS, and JavaScript. It showcases various types of SQL Injection attacks and provides insights into securing web applications against such vulnerabilities.

## Features
- User Registration and Login: Allows users to register and log in with a username and password.
- SQL Injection Demonstration: Demonstrates common SQL Injection attacks, including Bypass and Blind SQL Injection.
- Error Handling and Timeout: Implements client-side and server-side execution timeouts to prevent resource overuse and improve security.
- Secure Coding Practices: Highlights the importance of using prepared statements and input validation to prevent SQL Injection.

## Installation
1. run `npm install`
2. run the server by `node server.js`
3. open a browser and type the URL: http://localhost:3000/

if npm install not working, please the commands below to install the packages:

`npm install express sqlite3`

`npm install bcrypt`

`npm install express-session cookie-parser`

## Code Explanation
### Client-side Code: home.js
The client-side code handles user interactions and makes API calls to the server. It includes features like input validation, error handling, and timeout for API requests.

- fetchWithTimeout: A utility function to perform fetch requests with a timeout.
- Event Listeners: Attached to buttons and input fields to handle user actions.
- API Calls: Functions like performLogin, handleRegister, handleBypassInjection, handleBlindInjection, and handlePasswordChange make API calls to the server.

### Server-side Code: server.js
The server-side code uses Express.js to handle API requests and SQLite as the database.

-Endpoints: /login, /register, /change-password, and /logout handle respective actions.
-SQL Injection Demonstration: Shows how SQL queries can be manipulated and the importance of using secure coding practices.

## Testing
### Register
To test the register, please enter the username and password. Although username and password does not have any requirements, fail to enter any of the two fields will not able to register

### Login
To test the login, please make sure register the user first. Same as register, fail to enter any of the two fields (username or password) will not able to login. Login an unexistence user will also fail.

### Testing Field
#### Bypassing SQL Injection: 
1. Please go the API endpoint for /login in server.js. Uncomment the injection attack code and comment the code that protect injection attack. There is a text divider for both sections. 
2. After uncomment and comment the code, please restart the server (ctrl+c to stop the current server and run `node server.js` again). 
3. Reload the page of localhost, register an user.
4. Pressed Bypassing SQL Injection button to send the injection attack.

#### Blind SQL Injection:
If you already uncomment and comment the code from Bypassing SQL Injection, you can skip the 1st & 2nd steps.
1. Please go the API endpoint for /login in server.js. Uncomment the injection attack code and comment the code that protect injection attack. There is a text divider for both sections. 
2. After uncomment and comment the code, please restart the server (ctrl+c to stop the current server and run `node server.js` again). 
3. Reload the page of localhost, register an user with the username as "admin".
4. Pressed Blind SQL Injection button to send the injection attack.

#### Change password:
The purpose of changing password is to show if the attacker login the user account by injection attack. The attacker is able to perform unauthorized actions to user. In my case, change the password.
1. Login a user, can be either login by enter the credentials or a injection attack.
2. Click Change Password button. Note: it will change the password to default password "password". Now the user need to enter the username and the password as "password" to login

Note: For testing purpose, I create an API to check the data. By entering: `http://localhost:3000/dump` to see all the data in the database. The password hash value will change after changing password. You can refresh `http://localhost:3000/dump` to check the updated hash value.

## Secure Coding Standard for JavaScript
Reference:

https://owasp.org/Top10/

https://owasp.org/API-Security/editions/2023/en/0x11-t10/

https://assurance.ncsa.gov.qa/sites/default/files/library/2018-10/MOTC-CIPD_JavaScript_Coding_Standard%28US%29.pdf





