import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

console.log("Connecting with:");
console.log("User:", process.env.PG_USER);
console.log("Host:", process.env.PG_HOST);
console.log("Port:", process.env.PG_PORT);
console.log("Database:", process.env.PG_NAME);
console.log("Password:", process.env.PG_PASSWORD);

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_NAME,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

const addLanguages = async () => {
  const query = `
    SELECT setval('users_id_seq', 1, false);
    INSERT INTO "ProgramingLanguages" (name)
    VALUES 
        ('JavaScript'), 
        ('Python'), 
        ('C++'), 
        ('Java'), 
        ('Ruby'), 
        ('Go'), 
        ('PHP'), 
        ('Swift'), 
        ('Kotlin'), 
        ('TypeScript'), 
        ('Rust'), 
        ('Perl'), 
        ('Scala'), 
        ('Lua');
`;

  try {
    console.log("Running query:", query);
    const res = await pool.query(query);
    console.log("Query executed successfully", res);
  } catch (err) {
    console.error("Error executing query", err.stack);
  } finally {
    pool.end();
  }
};

await addLanguages();
