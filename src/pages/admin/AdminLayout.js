import React from 'react';
import AdminSidebar from '../../components/sidebar/AdminSidebar';

const AdminLayout = ({ children }) => {
  return (
      <div style={{ display: 'flex', margin: '20px' }}>
        {/* 공통 사이드바 */}
        <AdminSidebar />
        {/* 페이지별 컨텐츠 */}
        <div style={{
          flex: 1,
          padding: '20px',
          border: '2px solid gray',
          borderRadius: '10px'
        }}>
          {children}
        </div>
      </div>
  );
};

export default AdminLayout;
