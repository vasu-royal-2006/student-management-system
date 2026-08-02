import React from 'react';
import { Search, Bell, Sun, Moon } from 'lucide-react';

const Header = ({ searchQuery, setSearchQuery }) => {
  return (
    <header style={{ 
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
      marginBottom: '2rem' 
    }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Dashboard</h1>
        <p className="text-muted">23 September, 2024</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ position: 'relative', width: '350px' }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search anything..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ background: '#FFFFFF', boxShadow: '0 5px 15px rgba(0,0,0,0.03)' }}
          />
          <div style={{ 
            position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
            background: 'var(--bg-main)', padding: '4px 8px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)'
          }}>⌘F</div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button style={{ width: '45px', height: '45px', borderRadius: '50%', border: 'none', background: '#FFFFFF', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 5px 15px rgba(0,0,0,0.03)' }}>
            <Sun size={20} />
          </button>
          <button style={{ width: '45px', height: '45px', borderRadius: '50%', border: 'none', background: '#FFFFFF', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 5px 15px rgba(0,0,0,0.03)' }}>
            <Bell size={20} />
          </button>
          <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 5px 15px rgba(0,0,0,0.03)' }}>
            JD
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
