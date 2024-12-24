import dotenv from "dotenv";
import pool from "./db.js";
dotenv.config();

const addLanguages = async () => {
  const query = `
    TRUNCATE TABLE "ProgramingLanguages" RESTART IDENTITY;
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
        ('Lua'),
        ('C#'), 
        ('HTML'), 
        ('CSS')
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
