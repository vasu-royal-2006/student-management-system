const express = require('express');
const router = express.Router();
const db = require('../database');

// GET all students (with optional search)
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    if (search) {
      const searchTerm = `%${search}%`;
      const [rows] = await db.query(
        "SELECT * FROM students WHERE firstName LIKE ? OR lastName LIKE ? OR email LIKE ? OR major LIKE ?", 
        [searchTerm, searchTerm, searchTerm, searchTerm]
      );
      res.json(rows);
    } else {
      const [rows] = await db.query("SELECT * FROM students");
      res.json(rows);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single student
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query("SELECT * FROM students WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ error: "Student not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new student
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, major, enrollmentDate, gpa } = req.body;
    if (!firstName || !lastName || !email || !major) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const sql = `INSERT INTO students (firstName, lastName, email, major, enrollmentDate, gpa) VALUES (?, ?, ?, ?, ?, ?)`;
    const params = [firstName, lastName, email, major, enrollmentDate, gpa];

    const [result] = await db.query(sql, params);
    res.status(201).json({
      message: "success",
      studentId: result.insertId
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update student
router.put('/:id', async (req, res) => {
  try {
    const { firstName, lastName, email, major, enrollmentDate, gpa } = req.body;
    const { id } = req.params;

    const sql = `UPDATE students SET 
      firstName = COALESCE(?, firstName),
      lastName = COALESCE(?, lastName),
      email = COALESCE(?, email),
      major = COALESCE(?, major),
      enrollmentDate = COALESCE(?, enrollmentDate),
      gpa = COALESCE(?, gpa)
      WHERE id = ?`;
    const params = [firstName, lastName, email, major, enrollmentDate, gpa, id];

    const [result] = await db.query(sql, params);
    res.json({ message: "success", changes: result.affectedRows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE student
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query("DELETE FROM students WHERE id = ?", [id]);
    res.json({ message: "deleted", changes: result.affectedRows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
