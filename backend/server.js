require('dotenv').config();
const express = require('express');
const cors = require('cors');
const studentRoutes = require('./routes/students');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/students', studentRoutes);

app.get('/', (req, res) => {
  res.send('Student Management System API is running...');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
