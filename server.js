// OWASP TOP 10 A08:2021 – Software and Data Integrity Failures:
// Ensure libraries and dependencies, such as npm or Maven, are consuming trusted repositories to prevent the problem.
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const https = require('https');

// OWASP TOP 10 A04:2021 – Insecure Design: To prevent the Insecure Design: 
// Establish and use a library of secure design patterns or paved road ready to use components from nodejs libraries
const bcrypt = require('bcrypt');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();
const port = 3000;
const secretKey = 'your_secret_key';

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Session setup
app.use(session({
    secret: secretKey,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true if using HTTPS
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        sameSite: 'lax' // Helps to prevent CSRF attacks
    }
}));

// Database setup
let db = new sqlite3.Database(':memory:', (err) => {
    // Handling Errors: Failed to connect to DB
    if (err) {
        console.error('Failed to connect to the database:', err.message);
        process.exit(1);
    }
    console.log('Connected to the in-memory SQLite database.');
});

// Create a table for sql
db.run('CREATE TABLE users(username TEXT, password TEXT)', (err) => {
    if (err) {
        console.error(err.message);
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
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

    // OWASP TOP 10 A10:2021 – Server-Side Request Forgery (SSRF): Sanitize and validate all client-supplied input data in application layer to avoid the problem.
    // OWASP API Security Top 10API7:2023 Server Side Request Forgery: same problem can be resolve above
    const sanitizedUsername = username.replace(/[^a-zA-Z0-9]/g, '');

    /*-----------------------Need to comment the below code if doing Injection attack ----------------------------------------------- */
    // The ? in the query is a placeholder for the sanitizedUsername. 
    // Using parameterized queries helps prevent SQL injection attacks by ensuring that the input is treated as a parameter rather than executable code.
    // OWASP TOP 10 A03:2021 – Injection: use ? instead of ${username} to prevent injections
    db.get('SELECT * FROM users WHERE username = ?', [sanitizedUsername], (err, row) => {

        // OWASP TOP 10 A03:2021 A09:2021 – Security Logging and Monitoring Failures: Display log for both success and failture of the request for
        // better montoring
        // Handling Errors: if server side encountered error, sent the error to user
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (row) {
            // OWASP TOP 10 A02:2021 – Cryptographic Failures: Encrypt the password, Will use the hash value to compare the hash value in the database
            // Compare the hashed password with the stored hashed password
            // Default method: bcrypt.compare(plainTextPassword, hashedPassword, callback)
            // bcrypt hashes the plain text password using the same salt and algorithm as the stored hash, and compare the stored hash value
            bcrypt.compare(password, row.password, (err, result) => {
                // Log in successfully, return the message
                if (result) {
                    // store the current username into the session
                    req.session.user = sanitizedUsername;
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
            // store the current username into the session
            req.session.user = username
            res.json({ message: 'Login successful' });
        }
        // Handling Errors: Invalid credentials. The result will return either true or false.
        else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    });
    */


});

// The authenticateSession middleware verifies if a user is logged in before allowing access to protected routes.
function authenticateSession(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
}

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
    // OWASP TOP 10 A10:2021 – Server-Side Request Forgery (SSRF): Sanitize and validate all client-supplied input data in application layer to avoid the problem.
    // OWASP API Security Top 10API7:2023 Server Side Request Forgery: same problem can be resolve above
    const sanitizedUsername = username.replace(/[^a-zA-Z0-9]/g, '');


    // The ? in the query is a placeholder for the sanitizedUsername. 
    // Using parameterized queries helps prevent SQL injection attacks by ensuring that the input is treated as a parameter rather than executable code. 
    // OWASP TOP 10 A03:2021 – Injection: use ? instead of ${username} to prevent injections
    db.get('SELECT * FROM users WHERE username = ?', [sanitizedUsername], (err, row) => {
        // OWASP TOP 10 A03:2021 A09:2021 – Security Logging and Monitoring Failures: Display log for both success and failture of the request for
        // better montoring
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
            // OWASP TOP 10 A02:2021 – Cryptographic Failures: Encrypt the sensitive data, password and store it into the database.
            // Hash the default password. the password is hashed using bcrypt.
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

// OWASP TOP 10 A01:2021 – Broken Access Control: To resolve the accessing API with missing access controls for POST, PUT and DELETE problem
// I limited accessing the change password POST api to those who login by checking the session, and the user only able to change his/her own password.
// OWASP TOP 10 API1:2023 Broken Object Level Authorization: Make sure the user is logged in, and the user will have the perform the API call.
// API endpoint to handle password change
app.post('/change-password', authenticateSession, (req, res, next) => {
    try {
        // Extracts the logged-in user from the session
        const { user } = req.session;

        // The change password button will set the default password to 'password'
        const defaultPassword = 'password';

        // OWASP TOP 10 A02:2021 – Cryptographic Failures: Encrypt the password, Will use the hash value to compare the hash value in the database
        // Compare the hashed password with the stored hashed password
        // Default method: bcrypt.compare(plainTextPassword, hashedPassword, callback)
        // bcrypt hashes the plain text password using the same salt and algorithm as the stored hash, and compare the stored hash value
        bcrypt.hash(defaultPassword, 10, (err, hashedPassword) => {
            // OWASP TOP 10 A03:2021 A09:2021 – Security Logging and Monitoring Failures: Display log for both success and failture of the request for
            // better montoring
            // Handling Errors: Unable to hash the default password
            if (err) {
                console.error('Error hashing default password:', err.message);
                return next(err);
            }

            // Updates the password in the database for the logged-in user
            db.run('UPDATE users SET password = ? WHERE username = ?', [hashedPassword, user], (err) => {
                if (err) {
                    // Handling Errors: Unable to update the password, return the error message
                    console.error('Error updating password:', err.message);
                    return next(err);
                }
                // Update successfully, send the message back to user
                res.json({ message: 'Password changed successfully' });
            });
        });
    } catch (error) {
        // Handling Errors: handle any expected errors, return the errors to middleware
        console.error('Error processing password change:', error);
        next(error);
    }
});


// API endpoint to handle logout
app.post('/logout', (req, res) => {
    // Destory the session information when logout
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Failed to log out' });
        }
        res.json({ message: 'Logout successful' });
    });
});

// API endpoint that have all the user data, for testing purpose
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
// NOTE: The browser sends warning and saying the key and cert I created is not safe.The workaround is to ignore the warning since is it localhost.
// I am still try to find a way to use a trust certicate for localhost so I can bypass the browser warning.

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