# CS 6387 Assignment 2 - Secure Programming
## Project Description
This project demonstrates SQL Injection vulnerabilities and how to mitigate them. The application is built using a simple Node.js backend with an in-memory SQLite database and a front-end using HTML, CSS, and JavaScript. It showcases various types of SQL Injection attacks and provides insights into securing web applications against such vulnerabilities.

## Features
- User Registration and Login: Allows users to register and log in with a username and password.
- SQL Injection Demonstration: Demonstrates common SQL Injection attacks, including Bypass and Blind SQL Injection.
- Error Handling and Timeout: Implements client-side and server-side execution timeouts to prevent resource overuse and improve security.
- Secure Coding Practices: Highlights the importance of using prepared statements and input validation to prevent SQL Injection.

## Installation
1. run `npm install`
2. run the server by `node server.js`
3. open a browser and type the URL: http://localhost:3000/

if npm install not working, please run the commands below to install the packages:

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
To test the login functionality, please ensure you have registered the user first. Similar to registration, failing to enter either the username or password will prevent login. Logging in with a non-existent user will also fail.

### Login
To test the login, please make sure register the user first. Same as register, fail to enter any of the two fields (username or password) will not able to login. Login an unexistence user will also fail.

### Testing Field
#### Bypassing SQL Injection: 
1. Go to the API endpoint for /login in server.js. Uncomment the injection attack code and comment out the code that protects against injection attacks. There is a text divider for both sections. 
2. After uncommenting and commenting the code, please restart the server (ctrl+c to stop the current server and run node server.js again).
3. Reload the page of localhost, register an user.
4. Pressed Bypassing SQL Injection button to send the injection attack.

#### Blind SQL Injection:
If you have already uncommented and commented the code from Bypassing SQL Injection, you can skip the first two steps.
1. Go to the API endpoint for /login in server.js. Uncomment the injection attack code and comment out the code that protects against injection attacks. There is a text divider for both sections. 
2. After uncomment and comment the code, please restart the server (ctrl+c to stop the current server and run `node server.js` again). 
3. Reload the page of localhost, register an user with the username as "admin".
4. Pressed Blind SQL Injection button to send the injection attack.

#### Change password:
The purpose of changing the password is to show that if the attacker logs into the user account through an injection attack, they can perform unauthorized actions as the user. In this case, changing the password.
1. Login a user, can be either login by enter the credentials or a injection attack.
2. Click the Change Password button. Note: This will change the password to the default password "password". The user will now need to enter the username and the password "password" to log in.

Note: For testing purposes, an API endpoint to check the data has been created. By navigating to `http://localhost:3000/dump`, you can see all the data in the database. The password hash value will change after changing the password. You can refresh `http://localhost:3000/dump` to check the updated hash value.

## Secure Coding Standard for JavaScript
Reference:

https://owasp.org/Top10/

https://owasp.org/API-Security/editions/2023/en/0x11-t10/

https://assurance.ncsa.gov.qa/sites/default/files/library/2018-10/MOTC-CIPD_JavaScript_Coding_Standard%28US%29.pdf





