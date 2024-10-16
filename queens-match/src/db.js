// src/db.js
import pkg from 'pg'; // Import the entire pg module
const { Pool } = pkg; // Destructure Pool from the pg module
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file

const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST, // The service name in docker-compose
    database: process.env.PG_NAME,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});

export default pool;

