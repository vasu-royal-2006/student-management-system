import React from 'react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { name: 'Jan', value: 2000 },
  { name: 'Feb', value: 3500 },
  { name: 'Mar', value: 2800 },
  { name: 'Apr', value: 5000 },
  { name: 'May', value: 3200 },
  { name: 'Jun', value: 4100 },
  { name: 'Jul', value: 3000 },
  { name: 'Aug', value: 4000 },
  { name: 'Sep', value: 3500 },
];

const StatCharts = () => {
  return (
    <div className="grid-dashboard">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Enrollments Overview</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)' }}>5293</span>
              <span style={{ color: 'var(--success)', fontWeight: 600, fontSize: '0.875rem' }}>↗ 12%</span>
            </div>
          </div>
          <select style={{ border: 'none', background: 'var(--bg-main)', padding: '6px 12px', borderRadius: '8px', color: 'var(--text-main)', fontWeight: 500, outline: 'none' }}>
            <option>Monthly</option>
            <option>Weekly</option>
          </select>
        </div>
        
        <div style={{ height: '250px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 12}} dy={10} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-card)' }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="var(--primary)" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorValue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Popular Courses</h3>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 600 }}>
              <span>UI/UX Design</span>
            </div>
            <div style={{ height: '8px', background: 'var(--bg-main)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '85%', background: 'var(--primary)', borderRadius: '4px' }}></div>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 600 }}>
              <span>Web Development</span>
            </div>
            <div style={{ height: '8px', background: 'var(--bg-main)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '70%', background: 'var(--warning)', borderRadius: '4px' }}></div>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 600 }}>
              <span>Motion Design</span>
            </div>
            <div style={{ height: '8px', background: 'var(--bg-main)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '45%', background: 'var(--success)', borderRadius: '4px' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCharts;
