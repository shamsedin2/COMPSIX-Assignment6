// Import the sqlite3 package
const sqlite3 = require('sqlite3').verbose();

// Create a new database called university.db
const db = new sqlite3.Database('./university.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the university database.');
    }
});

// Define the courses table using SQL CREATE TABLE command
db.run(`
    CREATE TABLE IF NOT EXISTS courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        courseCode TEXT NOT NULL,
        title TEXT NOT NULL,
        credits INTEGER NOT NULL,
        description TEXT,
        semester TEXT NOT NULL
    )
`, (err) => {
    if (err) {
        console.error('Error creating table:', err.message);
    } else {
        console.log('✅ Database and courses table created successfully!');
    }
    
    // Close the database connection
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Database connection closed.');
        }
    });
});
