import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentForm = ({ isOpen, onClose, student, refreshStudents }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    major: '',
    enrollmentDate: '',
    gpa: ''
  });

  useEffect(() => {
    if (student) {
      setFormData({
        firstName: student.firstName || '',
        lastName: student.lastName || '',
        email: student.email || '',
        major: student.major || '',
        enrollmentDate: student.enrollmentDate || '',
        gpa: student.gpa || ''
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        major: '',
        enrollmentDate: '',
        gpa: ''
      });
    }
  }, [student, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      if (student && student.id) {
        await axios.put(`${API_URL}/api/students/${student.id}`, formData);
      } else {
        await axios.post(`${API_URL}/api/students`, formData);
      }
      refreshStudents();
      onClose();
    } catch (error) {
      console.error("Error saving student record:", error);
      alert("Failed to save student record.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="glass-card modal-content">
        <div className="modal-header">
          <h2>{student ? 'Edit Student Profile' : 'Add New Student'}</h2>
          <button className="btn btn-secondary btn-icon" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>First Name</label>
              <input type="text" name="firstName" className="form-input" value={formData.firstName} onChange={handleChange} required />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Last Name</label>
              <input type="text" name="lastName" className="form-input" value={formData.lastName} onChange={handleChange} required />
            </div>
          </div>
          
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" className="form-input" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Major / Course</label>
            <input type="text" name="major" className="form-input" value={formData.major} onChange={handleChange} required />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Enrollment Date</label>
              <input type="date" name="enrollmentDate" className="form-input" value={formData.enrollmentDate} onChange={handleChange} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>GPA</label>
              <input type="number" step="0.01" min="0" max="4.0" name="gpa" className="form-input" value={formData.gpa} onChange={handleChange} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Profile</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;
