const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});

const users = [
    {
        user_type: 0,
        first_name: 'Emily',
        last_name: 'Johnson',
        email: 'emily.johnson@example.com',
        company: 'Tech Innovators',
        job_title: 'Intern',
        username: 'emily_j',
        password: 'password1', // Make sure to hash this
        linkedin: 'https://linkedin.com/in/emilyjohnson',
        profile_picture: 'avatar1.jpg',
        details: 'CS student passionate about software development and AI.',
        additional_info: 'Loves solving problems and is currently working on a machine learning project.'
    },
    {
        user_type: 0,
        first_name: 'Sophia',
        last_name: 'Williams',
        email: 'sophia.williams@example.com',
        company: 'Web Solutions',
        job_title: 'Frontend Developer',
        username: 'sophia_w',
        password: 'password2', // Make sure to hash this
        linkedin: 'https://linkedin.com/in/sophiawilliams',
        profile_picture: 'avatar2.jpg',
        details: 'Frontend developer with a love for user experience.',
        additional_info: 'Enjoys creating visually appealing and user-friendly web applications.'
    },
    {
        user_type: 0,
        first_name: 'Isabella',
        last_name: 'Brown',
        email: 'isabella.brown@example.com',
        company: 'Data Analytics Inc.',
        job_title: 'Data Analyst Intern',
        username: 'isabella_b',
        password: 'password3', // Make sure to hash this
        linkedin: 'https://linkedin.com/in/isabellabrown',
        profile_picture: 'avatar3.jpg',
        details: 'Aspiring data scientist with a background in statistics.',
        additional_info: 'Passionate about uncovering insights from data and loves working with Python.'
    },
    {
        user_type: 0,
        first_name: 'Mia',
        last_name: 'Garcia',
        email: 'mia.garcia@example.com',
        company: 'Cloud Solutions',
        job_title: 'Cloud Intern',
        username: 'mia_g',
        password: 'password4', // Make sure to hash this
        linkedin: 'https://linkedin.com/in/miagarcia',
        profile_picture: 'avatar4.jpg',
        details: 'CS student focusing on cloud computing and services.',
        additional_info: 'Keen on learning about cloud architectures and DevOps practices.'
    },
    {
        user_type: 0,
        first_name: 'Ava',
        last_name: 'Martinez',
        email: 'ava.martinez@example.com',
        company: 'Mobile Apps',
        job_title: 'Intern',
        username: 'ava_m',
        password: 'password5', // Make sure to hash this
        linkedin: 'https://linkedin.com/in/avamartinez',
        profile_picture: 'avatar5.jpg',
        details: 'Aspiring mobile developer passionate about app design.',
        additional_info: 'Currently developing a personal finance tracking app as a side project.'
    },
    {
        user_type: 0,
        first_name: 'Olivia',
        last_name: 'Davis',
        email: 'olivia.davis@example.com',
        company: 'Tech Startups',
        job_title: 'Software Intern',
        username: 'olivia_d',
        password: 'password6', // Make sure to hash this
        linkedin: 'https://linkedin.com/in/oliviadavis',
        profile_picture: 'avatar6.jpg',
        details: 'Software engineering student eager to learn and grow.',
        additional_info: 'Loves coding and participates in hackathons to enhance her skills.'
    },
    {
        user_type: 0,
        first_name: 'Chloe',
        last_name: 'Rodriguez',
        email: 'chloe.rodriguez@example.com',
        company: 'E-commerce Solutions',
        job_title: 'UI/UX Intern',
        username: 'chloe_r',
        password: 'password7', // Make sure to hash this
        linkedin: 'https://linkedin.com/in/chloerodriguez',
        profile_picture: 'avatar7.jpg',
        details: 'UI/UX student passionate about creating engaging designs.',
        additional_info: 'Aims to improve user experiences through research and design iterations.'
    },
    {
        user_type: 0,
        first_name: 'Charlotte',
        last_name: 'Wilson',
        email: 'charlotte.wilson@example.com',
        company: 'Tech Pioneers',
        job_title: 'Intern',
        username: 'charlotte_w',
        password: 'password8', // Make sure to hash this
        linkedin: 'https://linkedin.com/in/charlottewilson',
        profile_picture: 'avatar8.jpg',
        details: 'CS student interested in cybersecurity and ethical hacking.',
        additional_info: 'Active member of her university’s cybersecurity club and loves challenges.'
    },
    {
        user_type: 1,
        first_name: 'Jessica',
        last_name: 'Lee',
        email: 'jessica.lee@example.com',
        company: 'AI Innovations',
        job_title: 'Senior Developer',
        username: 'jessica_l',
        password: 'securePassword1', // Make sure to hash this
        linkedin: 'https://linkedin.com/in/jessicalee',
        profile_picture: 'avatar1.jpg',
        details: 'Senior developer specializing in AI and machine learning.',
        additional_info: 'Mentors junior developers and is passionate about AI ethics.'
    },
    {
        user_type: 1,
        first_name: 'Natalie',
        last_name: 'Hernandez',
        email: 'natalie.hernandez@example.com',
        company: 'Cybersecurity Solutions',
        job_title: 'Cybersecurity Expert',
        username: 'natalie_h',
        password: 'securePassword2', // Make sure to hash this
        linkedin: 'https://linkedin.com/in/nataliehernandez',
        profile_picture: 'avatar2.jpg',
        details: 'Cybersecurity expert with experience in penetration testing.',
        additional_info: 'Enthusiastic about sharing knowledge and speaking at tech conferences.'
    },
];

const seedData = async () => {
    try {
        for (const user of users) {
            const insertUserQuery = `
                INSERT INTO users (user_type, first_name, last_name, email, company, job_title, username, password, linkedin, profile_picture, details, additional_info)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);
            `;
            const insertUserValues = [
                user.user_type,
                user.first_name,
                user.last_name,
                user.email,
                user.company,
                user.job_title,
                user.username,
                user.password, // Ensure to hash the password if necessary
                user.linkedin,
                user.profile_picture,
                user.details,
                user.additional_info,
            ];
            await pool.query(insertUserQuery, insertUserValues);
            console.log(`Inserted user: ${user.username}`);
        }
        console.log('All users seeded successfully.');
    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        await pool.end();
    }
};

seedData();
