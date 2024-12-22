import pkg from 'pg'; // Default import
const { Pool } = pkg;  // Destructure the Pool class
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

// Create a new Pool instance for managing multiple database connections
const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST, // The service name in docker-compose
    database: process.env.PG_NAME,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});

// Async function to handle the database operation
const addLanguages = async () => {
    const query = `
        INSERT INTO ProgramingLanguages (name)
        VALUES ('JavaScript'), ('Python'), ('C++'), ('Java');
    `;

    try {
        // Execute the query using the pool
        const res = await pool.query(query);
        console.log('Query executed successfully', res);
    } catch (err) {
        console.error('Error executing query', err.stack);
    } finally {
        pool.end(); // Close the pool when done
    }
};

// Run the function to add languages
addLanguages();
