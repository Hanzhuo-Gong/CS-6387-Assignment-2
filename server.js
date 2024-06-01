const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Ensure your HTML, JS, and CSS are in the 'public' folder

// Database setup
let db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the in-memory SQLite database.');
});

// Create a table
db.run('CREATE TABLE users(username TEXT, password TEXT)', (err) => {
    if (err) {
        console.error(err.message);
    }
});

// API endpoint to handle login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (row) {
            res.json({ message: 'Login successful' });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    });
});

// API endpoint to handle registration
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    // Check if the username already exists
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (row) {
            // Username already exists
            return res.status(409).json({ message: 'Username already exists' });
        } else {
            // Insert the new user
            db.run('INSERT INTO users(username, password) VALUES(?, ?)', [username, password], function (err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.json({ message: 'User added successfully' });
            });
        }
    });
});

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