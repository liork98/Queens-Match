import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
import pool from "./db.js";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();
const port = 5001;

pool
  .connect()
  .then((client) => {
    console.log("Connected to the database");
    client.release();
  })
  .catch((err) => {
    console.error("Database connection error:", err.stack);
  });

app.use(cors());
app.use(express.json());

app.use(
  "/uploads",
  express.static(
    path.join(path.dirname(new URL(import.meta.url).pathname), "uploads"),
  ),
);

app.post("/api/scheduleAppointment", async (req, res) => {
  const { menteeId, mentorId, appointmentDate } = req.body;

  if (!menteeId || !mentorId || !appointmentDate) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    const query = `
      INSERT INTO appointments (mentee_id, mentor_id, appointment_date, status)
      VALUES ($1, $2, $3, 'pending')
      RETURNING *;
    `;
    const values = [menteeId, mentorId, appointmentDate];

    const result = await pool.query(query, values);

    res.status(201).json({
      message: "Appointment scheduled successfully!",
      appointment: result.rows[0],
    });
  } catch (error) {
    console.error("Error scheduling appointment:", error);
    res
      .status(500)
      .json({ message: "Failed to schedule appointment. Please try again." });
  }
});

app.post("/api/sendEmail", async (req, res) => {
  const { senderId, recipientEmail, subject, message } = req.body;

  if (!senderId || !recipientEmail || !subject || !message) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    const senderQuery = "SELECT * FROM users WHERE id = $1";
    const senderResult = await pool.query(senderQuery, [senderId]);

    if (senderResult.rows.length === 0) {
      return res.status(404).json({ message: "Sender not found." });
    }

    const sender = senderResult.rows[0];

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: sender.email,
      to: recipientEmail,
      subject: subject,
      text: message,
    };

    await transporter.sendMail(mailOptions);

    const updateEmailsQuery =
      "UPDATE users SET emails_sent = emails_sent + 1 WHERE id = $1";
    await pool.query(updateEmailsQuery, [senderId]);

    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res
      .status(500)
      .json({ message: "Failed to send email. Please try again." });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/getProfilePicture/:username", async (req, res) => {
  const { username } = req.params;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    const result = await pool.query(
      'SELECT profile_picture FROM "users" WHERE username = $1',
      [username],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ profilePicture: result.rows[0].profile_picture });
  } catch (error) {
    console.error("Error fetching profile picture:", error);
    res.status(500).json({ error: "Failed to fetch profile picture" });
  }
});

app.get("/api/languages", async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "ProgramingLanguages"');
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching programming languages:", error);
    res.status(500).json({ error: "Failed to fetch programming languages" });
  }
});

app.post("/register", async (req, res) => {
  let {
    user_type,
    first_name,
    last_name,
    phone_number,
    profile_picture,
    email,
    password,
    company,
    job_title,
    username,
    linkedin,
    details,
    additional_info,
  } = req.body;
  try {
    const checkUserQuery = "SELECT * FROM users WHERE email = $1";
    const checkUserValues = [email];
    const checkUserResult = await pool.query(checkUserQuery, checkUserValues);

    if (checkUserResult.rows.length > 0) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertUserQuery = `
            INSERT INTO users (user_type, first_name, last_name, phone_number, profile_picture, email, password, company, job_title, username, linkedin, details, additional_info)
            VALUES ($1, $2,
                    $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
            RETURNING id, username
        `;

    const insertUserValues = [
      user_type,
      first_name,
      last_name,
      phone_number,
      `Avatars/${profile_picture}`,
      email,
      hashedPassword,
      company,
      job_title,
      username,
      linkedin,
      details,
      additional_info,
    ];

    const insertUserResult = await pool.query(
      insertUserQuery,
      insertUserValues,
    );
    const newUser = insertUserResult.rows[0];

    const token = jwt.sign(
      { id: newUser.id, username: newUser.username },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1h" },
    );

    res.status(201).json({ token, message: "User registered successfully" });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const query = "SELECT * FROM users WHERE username = $1";
    const values = [username];
    const result = await pool.query(query, values);
    const user = result.rows[0];
    console.log("Fetched user from DB:", user);

    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid credentials- not use in DB" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials- no match" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1h" },
    );

    res.json({ token, user });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
});

const authenticateJWT = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_jwt_secret",
    );
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

app.get("/api/profile", authenticateJWT, async (req, res) => {
  try {
    console.log("User profile: ", req.user);

    const userId = req.user.id;
    const query =
      "SELECT id, user_type, first_name,email, company, job_title, username, profile_picture, details, last_name, linkedin, additional_info, id, phone_number, programing_languages FROM users WHERE id = $1";
    const values = [userId];
    const result = await pool.query(query, values);
    const user = result.rows[0];
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
    console.log("User profile: ", user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

const findById = async (userId) => {
  try {
    const query = "SELECT * FROM users WHERE id = $1";
    const values = [userId];

    const result = await pool.query(query, values);

    if (result.rows.length > 0) {
      return result.rows[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const __dirname =
      "/Users/liorkashi/Desktop/Queen B Bootcamp/Project/queens-match/public/assets/";
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname).toLowerCase();
    if (extname !== ".jpg" && extname !== ".jpeg") {
      console.log("extname: " + extname);
      return cb(new Error("Only JPG or JPEG files are allowed"));
    }
    cb(null, Date.now() + extname);
  },
});

const upload = multer({ storage: storage });

app.put(
  "/api/changeProfile",
  authenticateJWT,
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      console.log("STARTING PROFILE");
      const userId = req.user.id;
      const {
        email,
        username,
        phone,
        programmingLanguages,
        linkedin,
        details,
        additionalInformation,
        jobTitle,
      } = req.body;

      const user = await findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const updatedEmail = email || user.email;
      const updatedUsername = username || user.username;
      const updatedPhone = phone || user.phone_number;

      const updatedLinkedin = linkedin || user.linkedin;
      const updatedProgrammingLanguages = programmingLanguages
        ? JSON.parse(programmingLanguages)
        : user.programing_languages;

      const updatedProfilePicture = req.file
        ? "/uploads/" + req.file.filename
        : user.profile_picture;
      const updatedAdditionalInformation =
        additionalInformation || user.additionalInformation;
      const updatedJobTitle = jobTitle || user.job_title;
      const updatedDetails = details || user.details;

      const updateQuery = `
        UPDATE users
        SET email = $1, username = $2, phone_number = $3, linkedin = $4, programing_languages = $5, profile_picture = $6, additional_info= $7, job_title = $8, details = $9
        WHERE id = $10
          RETURNING *;
      `;

      const formattedProgrammingLanguages = `{${updatedProgrammingLanguages.join(",")}}`;

      const updateValues = [
        updatedEmail,
        updatedUsername,
        updatedPhone,
        updatedLinkedin,
        formattedProgrammingLanguages,
        updatedProfilePicture,
        updatedAdditionalInformation,
        updatedJobTitle,
        updatedDetails,
        userId,
      ];

      console.log(updateValues);

      const result = await pool.query(updateQuery, updateValues);

      const updatedUser = result.rows[0];
      res.status(200).json({
        message: "Profile updated successfully!",
        data: {
          email: updatedUser.email,
          username: updatedUser.username,
          phone: updatedUser.phone_number,
          linkedin: updatedUser.linkedin,
          programmingLanguages: updatedUser.programing_languages,
          profilePicture: updatedUser.profile_picture,
          additionalInformation: updatedUser.additional_info,
          jobTitle: updatedUser.job_title,
          details: updatedUser.details,
        },
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      res
        .status(500)
        .json({ message: "Failed to update profile. Please try again later." });
    }
  },
);

app.get("/api/appointments/:userId", async (req, res) => {
  console.log(`GET /api/appointments/${req.params.user}`);
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    const query = `
      SELECT
        a.id,
        a.appointment_date,
        a.status,
        u1.first_name AS mentee_name,
        u2.first_name AS mentor_name
      FROM appointments a
      JOIN users u1 ON a.mentee_id = u1.id
      JOIN users u2 ON a.mentor_id = u2.id
      WHERE a.mentee_id = $1 OR a.mentor_id = $1
      ORDER BY a.appointment_date ASC;
    `;
    const values = [userId];

    const result = await pool.query(query, values);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Failed to fetch appointments." });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
