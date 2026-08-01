const express = require('express');
const router = express.Router();
const db = require('../database');

// GET all students
router.get('/', (req, res) => {
  db.all("SELECT * FROM students", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// GET single student
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM students WHERE id = ?", [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(row);
  });
});

// POST new student
router.post('/', (req, res) => {
  const { firstName, lastName, email, major, enrollmentDate, gpa } = req.body;
  if (!firstName || !lastName || !email || !major) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const sql = `INSERT INTO students (firstName, lastName, email, major, enrollmentDate, gpa) VALUES (?, ?, ?, ?, ?, ?)`;
  const params = [firstName, lastName, email, major, enrollmentDate, gpa];

  db.run(sql, params, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      studentId: this.lastID
    });
  });
});

// PUT update student
router.put('/:id', (req, res) => {
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

  db.run(sql, params, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: "success", changes: this.changes });
  });
});

// DELETE student
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM students WHERE id = ?", id, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: "deleted", changes: this.changes });
  });
});

module.exports = router;
