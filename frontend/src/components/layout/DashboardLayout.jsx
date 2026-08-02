import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const DashboardLayout = ({ children, searchQuery, setSearchQuery }) => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
