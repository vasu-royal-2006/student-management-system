import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StatCharts from '../components/dashboard/StatCharts';
import StudentList from '../components/StudentList';
import StudentForm from '../components/StudentForm';

const DashboardPage = ({ searchQuery }) => {
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const fetchStudents = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const url = searchQuery 
        ? `${API_URL}/api/students?search=${encodeURIComponent(searchQuery)}`
        : `${API_URL}/api/students`;
      const response = await axios.get(url);
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [searchQuery]);

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
      <StatCharts />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', marginTop: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Student Directory</h2>
        <button className="btn btn-primary" onClick={handleAddStudent}>
          + Add New Student
        </button>
      </div>

      <StudentList 
        students={students} 
        refreshStudents={fetchStudents} 
        onEdit={handleEditStudent} 
      />

      <StudentForm 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        student={editingStudent}
        refreshStudents={fetchStudents}
      />
    </>
  );
};

export default DashboardPage;
