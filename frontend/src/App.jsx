import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StudentList from './components/StudentList';
import StudentForm from './components/StudentForm';

function App() {
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/students');
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleAddStudent = () => {
    setEditingStudent(null);
    setIsModalOpen(true);
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="title-gradient" style={{ marginBottom: '0.5rem' }}>Student Management System</h1>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>
            Database-driven management application for accurate record retrieval.
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleAddStudent}>
          + Add New Student
        </button>
      </div>

      <main className="glass-card">
        <StudentList 
          students={students} 
          refreshStudents={fetchStudents} 
          onEdit={handleEditStudent} 
        />
      </main>

      <StudentForm 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        student={editingStudent}
        refreshStudents={fetchStudents}
      />
    </>
  );
}

export default App;
