import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";
dotenv.config();

export const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

const createAppointmentsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS appointments (
      id SERIAL PRIMARY KEY,
      mentee_id INT NOT NULL,
      mentor_id INT NOT NULL,
      appointment_date TIMESTAMP NOT NULL,
      status VARCHAR(50) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    const result = await pool.query(query);
    console.log("Table 'appointments' created successfully.");
  } catch (error) {
    console.error("Error creating table 'appointments':", error);
  }
};

export default pool;
