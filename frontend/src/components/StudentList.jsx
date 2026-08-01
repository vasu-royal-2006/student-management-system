import React from 'react';
import axios from 'axios';

const StudentList = ({ students, refreshStudents, onEdit }) => {
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student record?")) {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        await axios.delete(`${API_URL}/api/students/${id}`);
        refreshStudents();
      } catch (error) {
        console.error("Error deleting student:", error);
        alert("Failed to delete student record.");
      }
    }
  };

  if (!students || students.length === 0) {
    return (
      <div className="glass-card empty-state">
        <h3 style={{ margin: '0 0 1rem 0' }}>No student records found</h3>
        <p>Click "Add New Student" to get started.</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Major</th>
            <th>Enrolled</th>
            <th>GPA</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td style={{ fontWeight: 500, color: 'white' }}>
                {student.firstName} {student.lastName}
              </td>
              <td>{student.email}</td>
              <td>{student.major}</td>
              <td>{student.enrollmentDate || '-'}</td>
              <td>{student.gpa || '-'}</td>
              <td className="actions-cell" style={{ justifyContent: 'flex-end' }}>
                <button className="btn btn-secondary btn-icon" onClick={() => onEdit(student)}>
                  ✎
                </button>
                <button className="btn btn-danger btn-icon" onClick={() => handleDelete(student.id)}>
                  🗑
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentList;
