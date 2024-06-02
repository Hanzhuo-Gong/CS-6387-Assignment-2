openssl genrsa -out key.pem 2048
openssl req -new -key key.pem -out csr.pem
openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out cert.pem

npm install express sqlite3
npm install bcrypt
npm install express-session


node server.js


## Secure Coding Standard for JavaScript
https://assurance.ncsa.gov.qa/sites/default/files/library/2018-10/MOTC-CIPD_JavaScript_Coding_Standard%28US%29.pdf