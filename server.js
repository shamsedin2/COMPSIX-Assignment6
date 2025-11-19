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

// Import the sqlite3 package
const sqlite3 = require('sqlite3').verbose();

// Connect to the university.db database
const db = new sqlite3.Database('./university.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the university database.');
    }
});

// SQL INSERT statements for all courses
const courses = [
    {
        courseCode: 'CS101',
        title: 'Intro Programming',
        credits: 3,
        description: 'Learn Python basics',
        semester: 'Fall 2024'
    },
    {
        courseCode: 'BIO120',
        title: 'General Biology',
        credits: 3,
        description: 'Introduction to biological principles',
        semester: 'Fall 2024'
    },
    {
        courseCode: 'MATH150',
        title: 'Calculus I',
        credits: 4,
        description: 'Basic calculus',
        semester: 'Fall 2024'
    },
    {
        courseCode: 'ENG101',
        title: 'Composition I',
        credits: 3,
        description: 'Academic writing and critical thinking',
        semester: 'Spring 2025'
    },
    {
        courseCode: 'ME210',
        title: 'Thermodynamics',
        credits: 3,
        description: 'Principles of thermodynamics and heat transfer',
        semester: 'Spring 2025'
    },
    {
        courseCode: 'CS301',
        title: 'Database Systems',
        credits: 3,
        description: 'Design and implementation of database systems',
        semester: 'Fall 2024'
    },
    {
        courseCode: 'PHYS201',
        title: 'Physics II',
        credits: 4,
        description: 'Electricity, magnetism, and modern physics',
        semester: 'Spring 2025'
    },
    {
        courseCode: 'CS201',
        title: 'Data Structures',
        credits: 4,
        description: 'Study of fundamental data structures and algorithms',
        semester: 'Spring 2025'
    }
];

// Insert each course into the database
const insertSQL = `
    INSERT INTO courses (courseCode, title, credits, description, semester)
    VALUES (?, ?, ?, ?, ?)
`;

// Use db.serialize to ensure queries run in order
db.serialize(() => {
    // Prepare the statement
    const stmt = db.prepare(insertSQL);
    
    // Insert each course
    courses.forEach(course => {
        stmt.run(
            course.courseCode,
            course.title,
            course.credits,
            course.description,
            course.semester
        );
    });
    
    // Finalize the statement
    stmt.finalize((err) => {
        if (err) {
            console.error('Error inserting data:', err.message);
        } else {
            console.log('✅ All courses successfully added to the database!');
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
});
// Import required packages
const express = require('express');
const sqlite3 = require('sqlite3').verbose();

// Create Express app
const app = express();
const PORT = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Connect to the SQLite database
const db = new sqlite3.Database('./university.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the university database.');
    }
});

app.get('/api/courses', (req, res) => {
    const sql = 'SELECT * FROM courses';
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(200).json({
                message: 'success',
                data: rows
            });
        }
    });
});

app.get('/api/courses/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'SELECT * FROM courses WHERE id = ?';
    
    db.get(sql, [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (!row) {
            res.status(404).json({ error: 'Course not found' });
        } else {
            res.status(200).json({
                message: 'success',
                data: row
            });
        }
    });
});
app.post('/api/courses', (req, res) => {
    const { courseCode, title, credits, description, semester } = req.body;
    
    // Validate required fields
    if (!courseCode || !title || !credits || !semester) {
        return res.status(400).json({ 
            error: 'Missing required fields: courseCode, title, credits, and semester are required' 
        });
    }
    
    const sql = `
        INSERT INTO courses (courseCode, title, credits, description, semester)
        VALUES (?, ?, ?, ?, ?)
    `;
    
    db.run(sql, [courseCode, title, credits, description, semester], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(201).json({
                message: 'Course created successfully',
                data: {
                    id: this.lastID,
                    courseCode,
                    title,
                    credits,
                    description,
                    semester
                }
            });
        }
    });
});

app.put('/api/courses/:id', (req, res) => {
    const id = req.params.id;
    const { courseCode, title, credits, description, semester } = req.body;
    
    // Validate required fields
    if (!courseCode || !title || !credits || !semester) {
        return res.status(400).json({ 
            error: 'Missing required fields: courseCode, title, credits, and semester are required' 
        });
    }
    
    const sql = `
        UPDATE courses 
        SET courseCode = ?, title = ?, credits = ?, description = ?, semester = ?
        WHERE id = ?
    `;
    
    db.run(sql, [courseCode, title, credits, description, semester, id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (this.changes === 0) {
            res.status(404).json({ error: 'Course not found' });
        } else {
            res.status(200).json({
                message: 'Course updated successfully',
                data: {
                    id: parseInt(id),
                    courseCode,
                    title,
                    credits,
                    description,
                    semester
                }
            });
        }
    });
});

app.delete('/api/courses/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM courses WHERE id = ?';
    
    db.run(sql, [id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (this.changes === 0) {
            res.status(404).json({ error: 'Course not found' });
        } else {
            res.status(200).json({
                message: 'Course deleted successfully',
                id: parseInt(id)
            });
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📚 Test the API at http://localhost:${PORT}/api/courses`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Database connection closed.');
        }
        process.exit(0);
    });
});

