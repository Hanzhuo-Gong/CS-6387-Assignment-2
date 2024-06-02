openssl genrsa -out key.pem 2048
openssl req -new -key key.pem -out csr.pem
openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out cert.pem

npm install express sqlite3
npm install bcrypt
npm install express-session cookie-parser


node server.js


### Note: Testing the injection attacks will disable the login button functionality because it won't bcrypt.compare to compare the hash value of the password with hash value in database.

### After login with injection attack. The attacker is also able to click the change password button to change the password. Please use refresh http://localhost:3000/dump to see the hash value update.

## Secure Coding Standard for JavaScript
https://assurance.ncsa.gov.qa/sites/default/files/library/2018-10/MOTC-CIPD_JavaScript_Coding_Standard%28US%29.pdf