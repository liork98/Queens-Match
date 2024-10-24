import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import pool from './db.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 5001;

// Check database connection
pool.connect()
    .then(client => {
        console.log("Connected to the database");
        client.release(); // Release the client after successful connection
    })
    .catch(err => {
        console.error("Database connection error:", err.stack);
    });

app.use(cors()); // Enable CORS for all requests
app.use(express.json()); // Parse JSON bodies



// API endpoint to get users
app.get('/api/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.json(result.rows); // Send user data as JSON
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/register', async (req, res) => {
    console.log("Register")
    const { user_type, first_name, last_name, profile_picture, email, password, company, job_title, username, linkedin, details, additional_info } = req.body;
    console.log('Signup attempt22:', { user_type, first_name, last_name, profile_picture, email, password, company, job_title, username, linkedin, details, additional_info });

    try {
        // Check if user already exists (by email)
        const checkUserQuery = 'SELECT * FROM users WHERE email = $1';
        const checkUserValues = [email];
        const checkUserResult = await pool.query(checkUserQuery, checkUserValues);

        if (checkUserResult.rows.length > 0) {
            console.log('User already exists');
            return res.status(409).json({ message: 'Email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into the database
        const insertUserQuery = `
            INSERT INTO users (user_type, first_name, last_name, profile_picture, email, password, company, job_title, username, linkedin, details, additional_info)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING id, username
        `;

        const insertUserValues = [
            user_type,        // $1
            first_name,       // $2
            last_name,        // $3
            profile_picture,   // $4
            email,            // $5
            hashedPassword,    // $6
            company,          // $7
            job_title,        // $8
            username,         // $9
            linkedin,         // $10
            details,          // $11
            additional_info    // $12
        ];

        const insertUserResult = await pool.query(insertUserQuery, insertUserValues);

        const newUser = insertUserResult.rows[0];

        // Optionally, create a JWT token for the new user
        const token = jwt.sign(
            { id: newUser.id, username: newUser.username },
            process.env.JWT_SECRET || 'your_jwt_secret',
            { expiresIn: '1h' }
        );

        res.status(201).json({ token, message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// Login endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('Login attempt:', { username, password });
    try {
        const query = 'SELECT * FROM users WHERE username = $1';
        const values = [username];

        const result = await pool.query(query, values);
        const user = result.rows[0];

        if (!user) {
            console.log('User not found');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare the password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            console.log('Invalid password');
            console.log('password:', password, '  user.password:', user.password);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create a JWT token
        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET || 'your_jwt_secret',
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (error) {
        console.error('Error during login:', error);

        // Only log password; user might be undefined if there's an error earlier
        console.log('password:', password);

        res.status(500).json({ message: 'Server error' });
    }
});



// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
