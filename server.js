const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const https = require('https');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Database setup
let db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the in-memory SQLite database.');
});

// Create a table for sql
db.run('CREATE TABLE users(username TEXT, password TEXT)', (err) => {
    if (err) {
        console.error(err.message);
    }
});

// API endpoint to handle login
app.post('/login', (req, res) => {
    const { username, password, type } = req.body;

    // Validate input, to make sure the user enter both username and password.
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    // Sanitize input, to ensure all user inputs are properly sanitized and validated before processing or storing them in the database.
    // This is using regex to make sure the username only contains lowercase letter, uppercase letter and digits.
    // Sanitizing the username ensures that it contains only valid characters and helps to prevent injection attacks.
    // The ^ inside the square brackets [] means "not".
    // a-zA-Z0-9 includes all lowercase letters (a-z), uppercase letters (A-Z), and digits (0-9).
    // g (global flag): This means the pattern should be applied globally across the entire string, not just the first occurrence.
    const sanitizedUsername = username.replace(/[^a-zA-Z0-9]/g, '');

    // The ? in the query is a placeholder for the sanitizedUsername. 
    // Using parameterized queries helps prevent SQL injection attacks by ensuring that the input is treated as a parameter rather than executable code.
    db.get('SELECT * FROM users WHERE username = ?', [sanitizedUsername], (err, row) => {

        // Handling Errors: if server side encountered error, sent the error to user
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (row) {
            // Compare the hashed password with the stored hashed password
            // Default method: bcrypt.compare(plainTextPassword, hashedPassword, callback)
            // bcrypt hashes the plain text password using the same salt and algorithm as the stored hash, and compare the stored hash value
            bcrypt.compare(password, row.password, (err, result) => {
                // Log in successfully, return the message
                if (result) {
                    res.json({ message: 'Login successful' });
                }
                // Handling Errors: Invalid credentials. The result will return either true or false.
                // True if provided password is correct, and the user is authenticated. Else it will return false
                else {
                    res.status(401).json({ message: 'Invalid credentials' });
                }
            });
        }
        // Handling Errors: username does not existed, return the error message
        else {
            res.status(401).json({ message: 'Username does not exist' });
        }
    });


    /*--------------------------------------BELOW ARE FOR INJECTION ATTACKS----------------------------------------------- */

    /*
    // Vulnerable query (for testing SQL injection) 
    // Below Code will make the injection attack successful, just for testing purpose.
    // Please commend the db.get() above to test this
    let query = "";

    // Bypassing Authentication: Vulnerable query (for testing SQL injection) 
    // This will bypass the authentication process and directly get the data.
    if (type === "bypass") {
        query = `SELECT * FROM users WHERE username = '${username}' OR '1'='1'`;
    }

    // Blind Authentication: Please make sure to REGISTER the admin first, since it is targeting the admin.
    // This type relies on asking the database true or false questions and determining the answer based on the application's response.
    if (type === "blind") {
        query = `SELECT * FROM users WHERE username = '${username}' AND 1=1`;
    }

    console.log(`Constructed SQL query: ${query}`);
    // Execute the constructed SQL query against the database
    db.get(query, (err, row) => {
        // Handling Errors: if server side encountered error, sent the error to user
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        console.log(`Query result: ${JSON.stringify(row)}`);
        // Log in successfully, return the message
        if (row) {
            res.json({ message: 'Login successful' });
        }
        // Handling Errors: Invalid credentials. The result will return either true or false.
        else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    });
    */


});

// API endpoint to handle registration
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    // Validate input, to make sure the user enter both username and password.
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    // Sanitize input, to ensure all user inputs are properly sanitized and validated before processing or storing them in the database.
    // This is using regex to make sure the username only contains lowercase letter, uppercase letter and digits. 
    // Sanitizing the username ensures that it contains only valid characters and helps to prevent injection attacks.
    // The ^ inside the square brackets [] means "not".
    // a-zA-Z0-9 includes all lowercase letters (a-z), uppercase letters (A-Z), and digits (0-9).
    // g (global flag): This means the pattern should be applied globally across the entire string, not just the first occurrence.
    const sanitizedUsername = username.replace(/[^a-zA-Z0-9]/g, '');


    // The ? in the query is a placeholder for the sanitizedUsername. 
    // Using parameterized queries helps prevent SQL injection attacks by ensuring that the input is treated as a parameter rather than executable code. 
    db.get('SELECT * FROM users WHERE username = ?', [sanitizedUsername], (err, row) => {

        // Handling Errors: if server side encountered error, sent the error to user
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // Handling Errors: Username already exists, existed username is prohibited.
        if (row) {
            return res.status(409).json({ message: 'Username already exists' });
        }
        // Passwords are typically hashed before storing in the database for security reasons. 
        // When a user attempts to log in, their entered password is hashed and compared to the stored hashed password.
        else {

            // Hash the password. the password is hashed using bcrypt.
            // This function hashes the password with a salt factor of 10. The salt factor determines the computational cost of hashing; 
            // Higher values increase security but require more processing time.
            bcrypt.hash(password, 10, (err, hashedPassword) => {

                // Handling Errors: if server side encountered error, sent the error to user
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                // Inserted into the users table with the sanitizedUsername and the hashedPassword.
                db.run('INSERT INTO users(username, password) VALUES(?, ?)', [sanitizedUsername, hashedPassword], function (err) {
                    // Handling Errors: if server side encountered error, sent the error to user
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }

                    // Register successfully, sent the response message back to user
                    res.json({ message: 'User added successfully' });
                });
            });
        }
    });

});


app.get('/dump', (req, res) => {
    db.all('SELECT * FROM users', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ users: rows });
    });
});
/*
// Below is to start the server as https

// Read SSL certificate and key files
const sslOptions = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};

// Create HTTPS server
https.createServer(sslOptions, app).listen(port, () => {
    console.log(`Server running at https://localhost:${port}/`);
});
*/

// start the server as http
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});


// Close the database connection when the application is terminated
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Closed the database connection.');
        process.exit(0);
    });
});