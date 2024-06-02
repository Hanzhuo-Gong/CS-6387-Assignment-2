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

if `npm install` not working, please the commands below to install the packages:
`npm install express sqlite3`
`npm install bcrypt`
`npm install express-session cookie-parser`

openssl genrsa -out key.pem 2048
openssl req -new -key key.pem -out csr.pem
openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out cert.pem


### Note: Testing the injection attacks will disable the login button functionality because it won't bcrypt.compare to compare the hash value of the password with hash value in database.

### After login with injection attack. The attacker is also able to click the change password button to change the password. Please use refresh http://localhost:3000/dump to see the hash value update.

## Secure Coding Standard for JavaScript
Reference:
https://owasp.org/Top10/
https://owasp.org/API-Security/editions/2023/en/0x11-t10/
https://assurance.ncsa.gov.qa/sites/default/files/library/2018-10/MOTC-CIPD_JavaScript_Coding_Standard%28US%29.pdf
