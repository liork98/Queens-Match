import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import pool from './db.js';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';


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



// Serve uploaded files from the 'uploads' directory
app.use('/uploads', express.static(path.join(path.dirname(new URL(import.meta.url).pathname), 'uploads')));

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

// Register endpoint
app.post('/register', async (req, res) => {
    let { user_type, first_name, last_name, phone_number, profile_picture, email, password, company, job_title, username, linkedin, details, additional_info } = req.body;
    profile_picture = '/assets/Avatars/' + profile_picture;
    try {
        // Check if user already exists (by email)
        const checkUserQuery = 'SELECT * FROM users WHERE email = $1';
        const checkUserValues = [email];
        const checkUserResult = await pool.query(checkUserQuery, checkUserValues);

        if (checkUserResult.rows.length > 0) {
            return res.status(409).json({ message: 'Email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into the database
        const insertUserQuery = `
            INSERT INTO users (user_type, first_name, last_name, phone_number, profile_picture, email, password, company, job_title, username, linkedin, details, additional_info)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
            RETURNING id, username
        `;

        const insertUserValues = [
            user_type,        // $1
            first_name,       // $2
            last_name,        // $3
            phone_number,     // $4
            profile_picture,  // $5
            email,            // $6
            hashedPassword,   // $7
            company,          // $8
            job_title,        // $9
            username,         // $10
            linkedin,         // $11
            details,          // $12
            additional_info   // $13
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
    try {
        const query = 'SELECT * FROM users WHERE username = $1';
        const values = [username];
        const result = await pool.query(query, values);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare the password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
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
        res.status(500).json({ message: 'Server error' });
    }
});



// Middleware to verify JWT token
const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {

        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        // Decode the JWT token to get user information (id, username, etc.)
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        req.user = decoded; // Store the decoded user info in req.user
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

// API endpoint to get logged-in user's profile data
app.get('/api/profile', authenticateJWT, async (req, res) => {
    try {
        const userId = req.user.id;

        const query = 'SELECT id, username, first_name, last_name, phone_number, profile_picture, email, company, job_title, linkedin, details, additional_info FROM users WHERE id = $1';
        const values = [userId];
        const result = await pool.query(query, values);

        const user = result.rows[0];
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Find user by ID
const findById = async (userId) => {
    try {
        const query = 'SELECT * FROM users WHERE id = $1'; // Assuming your table is named 'users' and you want to find by 'id'
        const values = [userId]; // Parameterized query to prevent SQL injection

        const result = await pool.query(query, values);

        // Check if a user was found
        if (result.rows.length > 0) {
            return result.rows[0]; // Return the first user found
        } else {
            return null; // No user found
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error; // Rethrow error so it can be handled by the calling function
    }
};


// Set up file upload using multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Resolve the directory where the uploads will be stored
        const __dirname = '/Users/liorkashi/Desktop/Queen B Bootcamp/Project/queens-match/public/assets/'
        cb(null, path.join(__dirname, 'uploads'));
    },
    filename: (req, file, cb) => {
        const extname = path.extname(file.originalname);  // Ensure correct extension
        if (extname !== '.JPG' && extname !== '.JPEG') {
            return cb(new Error('Only JPG or JPEG files are allowed'));
        }
        cb(null, Date.now() + extname);  // Save file with the correct extension
    }

});

const upload = multer({ storage: storage });

// PUT route to handle profile update
app.put('/api/changeProfile', authenticateJWT, upload.single('profilePicture'), async (req, res) => {
    try {

        console.log('Uploading profile picture********')

        //console.log(req.file);  // Check if the file is being uploaded

        const userId = req.user.id; // Get user ID from token (authenticateJWT)
        const { email, username, phone, programmingLanguages, linkedin } = req.body;

        // Call the custom findById function to get the user from the database
        const user = await findById(userId);
        //console.log(user)
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update profile data
        const updatedEmail = email || user.email;
        const updatedUsername = username || user.username;
        const updatedPhone = phone || user.phone_number;
        const updatedLinkedin = linkedin || user.linkedin;
        //const updatedProgrammingLanguages = programmingLanguages || user.programmingLanguages;

        // If there's a new profile picture, update it
        //const updatedProfilePicture = req.file ? req.file.path : user.profile_picture;
        const updatedProfilePicture = req.file ? '/assets/uploads/' + req.file.filename : user.profile_picture;

        // Now, update the user in the database
        console.log("profile_picture: " + updatedProfilePicture);
        const updateQuery = `
        UPDATE users 
        SET email = $1, username = $2, phone_number = $3, linkedin = $4, ,profile_picture = $5
        WHERE id = $6
        RETURNING *;
    `;

        const updateValues = [
            updatedEmail,
            updatedUsername,
            updatedPhone,
            updatedLinkedin,
            //updatedProgrammingLanguages,
            updatedProfilePicture,
            userId
        ];
        console.log("updatedProfilePic: " + updatedProfilePicture);
        const result = await pool.query(updateQuery, updateValues);

        // Respond with the updated user profile
        const updatedUser = result.rows[0];
        res.status(200).json({
            message: 'Profile updated successfully!',
            data: {
                email: updatedUser.email,
                username: updatedUser.username,
                phone: updatedUser.phone_number,
                linkedin: updatedUser.linkedin,
                //programmingLanguages: updatedUser.programmingLanguages,
                profilePicture: updatedUser.profile_picture,
            },
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Failed to update profile. Please try again later.' });
    }
});



// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
