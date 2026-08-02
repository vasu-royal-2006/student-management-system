import React from 'react';
import axios from 'axios';

const StudentList = ({ students, refreshStudents, onEdit, searchQuery, setSearchQuery }) => {
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

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Recent Enrollments</h3>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>Student: {students.length}/245</span>
        </div>
      </div>

      {!students || students.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-main)' }}>No student records found</h3>
          <p>Try a different search term or click "Add New Student".</p>
        </div>
      ) : (
        <div className="table-container" style={{ padding: 0, boxShadow: 'none' }}>
          <table>
            <thead>
              <tr>
                <th style={{ paddingLeft: '1rem' }}>Student Profile</th>
                <th>Major / Course</th>
                <th>Email Address</th>
                <th>Enrollment Date</th>
                <th>GPA</th>
                <th>Status</th>
                <th style={{ textAlign: 'right', paddingRight: '1rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => {
                const isHighGPA = parseFloat(student.gpa) >= 3.5;
                return (
                  <tr key={student.id}>
                    <td style={{ paddingLeft: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-main)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                          {student.firstName[0]}{student.lastName[0]}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{student.firstName} {student.lastName}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{student.major}</td>
                    <td style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{student.email}</td>
                    <td style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{student.enrollmentDate || '-'}</td>
                    <td style={{ fontWeight: 600 }}>{student.gpa || '-'}</td>
                    <td>
                      <span className={`status-pill ${isHighGPA ? 'status-completed' : 'status-progress'}`}>
                        {isHighGPA ? 'Honors' : 'Enrolled'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', paddingRight: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button style={{ border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }} onClick={() => onEdit(student)}>✎</button>
                        <button style={{ border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }} onClick={() => handleDelete(student.id)}>🗑</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentList;
