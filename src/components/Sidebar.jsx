import { NavLink } from 'react-router-dom';
import { Text, Title } from '@mantine/core';
import { IconBook, IconReceipt, IconSend } from '@tabler/icons-react';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Title order={3} mb={20}>ERP Rollup System</Title>
      
      <Text size="sm" c="dimmed" mb={10}>Navigation</Text>
      
      <NavLink 
        to="/groups" 
        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <IconBook size={18} style={{ marginRight: 10 }} />
          Groups
        </div>
      </NavLink>
      
      <NavLink 
        to="/journal-entries" 
        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <IconReceipt size={18} style={{ marginRight: 10 }} />
          Journal Entries
        </div>
      </NavLink>
      
      <NavLink 
        to="/send-and-record" 
        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <IconSend size={18} style={{ marginRight: 10 }} />
          Send & Record
        </div>
      </NavLink>
    </div>
  );
};

export default Sidebar;