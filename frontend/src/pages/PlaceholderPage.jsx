import React from 'react';

const PlaceholderPage = ({ title }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '60vh',
      background: 'var(--bg-card)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-card)',
      padding: '2rem'
    }}>
      <div style={{ 
        width: '80px', height: '80px', borderRadius: '50%', 
        background: 'rgba(67, 24, 255, 0.1)', color: 'var(--primary)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '32px', marginBottom: '1.5rem'
      }}>
        🚧
      </div>
      <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: 'var(--text-main)' }}>
        {title} Page
      </h2>
      <p style={{ color: 'var(--text-muted)', textAlign: 'center', maxWidth: '400px' }}>
        This page is currently under construction. Check back soon for exciting new features and analytics!
      </p>
    </div>
  );
};

export default PlaceholderPage;
