import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import PlaceholderPage from './pages/PlaceholderPage';

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <DashboardLayout searchQuery={searchQuery} setSearchQuery={setSearchQuery}>
      <Routes>
        <Route path="/" element={<DashboardPage searchQuery={searchQuery} />} />
        <Route path="/enrollments" element={<PlaceholderPage title="Enrollments" />} />
        <Route path="/courses" element={<PlaceholderPage title="Courses" />} />
        <Route path="/students" element={<PlaceholderPage title="Students" />} />
        <Route path="/trainers" element={<PlaceholderPage title="Trainers" />} />
        <Route path="/calendar" element={<PlaceholderPage title="Calendar" />} />
        <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
      </Routes>
    </DashboardLayout>
  );
}

export default App;
