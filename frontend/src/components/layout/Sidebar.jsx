import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, GraduationCap, Calendar, Settings, LogOut, FileText } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: FileText, label: 'Enrollments', path: '/enrollments' },
    { icon: BookOpen, label: 'Courses', path: '/courses' },
    { icon: GraduationCap, label: 'Students', path: '/students' },
    { icon: Users, label: 'Trainers', path: '/trainers' },
    { icon: Calendar, label: 'Calendar', path: '/calendar' },
  ];

  return (
    <aside style={{
      width: '260px',
      background: 'var(--bg-card)',
      borderRight: '1px solid var(--border)',
      padding: '2rem 1.5rem',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '3rem' }}>
        <div style={{ 
          width: '35px', height: '35px', borderRadius: '50%', 
          background: 'var(--primary)', color: 'white', 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 'bold', fontSize: '18px'
        }}>W</div>
        <h2 style={{ margin: 0, fontSize: '1.25rem' }}>WiselQ</h2>
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '1px' }}>Menu</p>
      
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: 'auto' }}>
        {menuItems.map((item, index) => (
          <NavLink 
            key={index} 
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '12px 16px', borderRadius: '12px',
              background: isActive ? 'var(--primary)' : 'transparent',
              color: isActive ? 'white' : 'var(--text-muted)',
              textDecoration: 'none',
              fontWeight: isActive ? 600 : 500,
              transition: 'all 0.2s ease'
            })}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div style={{ marginTop: '3rem' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '1px' }}>Others</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <NavLink to="/settings" style={({ isActive }) => ({ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', background: isActive ? 'var(--primary)' : 'transparent', color: isActive ? 'white' : 'var(--text-muted)', textDecoration: 'none', fontWeight: 500 })}>
            <Settings size={20} /> <span>Settings</span>
          </NavLink>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 500 }}>
            <LogOut size={20} /> <span>Log out</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
