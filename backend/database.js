const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'student_management',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function initDB() {
  try {
    // We first connect without the database to create it if it doesn't exist
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'student_management'}\`;`);
    await connection.end();

    // Now use the pool which has the database selected
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS students (
        id INT AUTO_INCREMENT PRIMARY KEY,
        firstName VARCHAR(255) NOT NULL,
        lastName VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        major VARCHAR(255) NOT NULL,
        enrollmentDate VARCHAR(255),
        gpa DECIMAL(3, 2)
      )
    `;
    await pool.query(createTableQuery);
    console.log('Connected to MySQL and initialized students table.');
  } catch (error) {
    console.error('MySQL database initialization failed:', error.message);
  }
}

initDB();

module.exports = pool;
