import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
  const history = useHistory();
  const location = useLocation();

  const tabs = [
    { id: 'mentor-request', label: '멘토 신청 목록' },
    { id: 'mentor-list', label: '멘토 목록' },
    { id: 'notice', label: '공지사항 관리' },
    { id: 'settlement', label: '정산 내역 관리' }
  ];

  return (
      <div style={{ width: '200px', marginRight: '20px' }}>
        {tabs.map(tab => (
            <div
                key={tab.id}
                onClick={() => history.push(`/admin/${tab.id}`)}
                style={{
                  padding: '10px',
                  cursor: 'pointer',
                  backgroundColor: location.pathname.includes(tab.id) ? '#f0f0f0' : 'white'
                }}
            >
              {tab.label}
            </div>
        ))}
      </div>
  );
};

export default AdminSidebar;
