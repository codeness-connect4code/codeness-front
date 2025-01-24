import React, { useState, useEffect } from 'react';
import { useHistory, Route, Switch } from 'react-router-dom';
import MentorRequestList from './mentor-request/MentorRequest'
import MentorRequestDetail from './mentor-request/MentorRequestDetail'

const AdminMyPageHome = () => {
  const [activeTab, setActiveTab] = useState('mentor-request');
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  const validateToken = (token) => {
    if (!token) return { isValid: false, role: null };
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return { isValid: false, role: null };
      const payload = JSON.parse(atob(parts[1]));
      return {
        isValid: !(payload.exp && payload.exp < Date.now() / 1000),
        role: payload.role
      };
    } catch (error) {
      return { isValid: false, role: null };
    }
  };

  useEffect(() => {
    checkRoleAndFetch();
  }, []);

  const checkRoleAndFetch = () => {
    const token = localStorage.getItem('jwtToken');
    const { isValid, role } = validateToken(token);

    if (!isValid) {
      localStorage.removeItem('jwtToken');
      history.push('/login');
      return;
    }

    setUserRole(role);
    setLoading(false);
  };

  const tabs = [
    { id: 'mentor-request', label: '멘토 신청 목록' },
    { id: 'mentor-list', label: '멘토 목록' },
    { id: 'notice', label: '공지사항 관리' },
    { id: 'settlement', label: '정산 내역 관리' }
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    history.push(`/admin/mypage/${tabId}`);
  };

  if (loading) return <div>로딩중...</div>;

  if (userRole !== 'ADMIN') {
    return (
        <div className="info-message">
          관리자만 접근 가능한 페이지입니다.
        </div>
    );
  }

  return (
      <div style={{ display: 'flex', margin: '20px' }}>
        <div style={{ width: '200px', marginRight: '20px' }}>
          {tabs.map(tab => (
              <div
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  style={{
                    padding: '10px',
                    cursor: 'pointer',
                    backgroundColor: activeTab === tab.id ? '#f0f0f0' : 'white'
                  }}
              >
                {tab.label}
              </div>
          ))}
        </div>

        <div style={{
          flex: 1,
          padding: '20px',
          border: '2px solid gray',
          borderRadius: '10px'
        }}>
          <Switch>
            <Route exact path="/admin/mypage/mentor-request" component={MentorRequestList} />
            <Route path="/admin/mypage/mentor-request/:mentorId" component={MentorRequestDetail} />
            <Route path="/admin/mypage/mentor-list">
              <div>멘토 목록</div>
            </Route>
            <Route path="/admin/mypage/notice">
              <div>공지사항 관리</div>
            </Route>
            <Route path="/admin/mypage/settlement">
              <div>정산 내역 관리</div>
            </Route>
          </Switch>
        </div>
      </div>
  );
};

export default AdminMyPageHome;