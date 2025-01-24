import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import '../../../styles/mypage/mentor-request/MentorRequestList.css'

const MentorRequestCard = ({ request, onDelete }) => (
    <div className="mentor-card">
      <div className="card-header">
        <h3 className="position">{request.position}</h3>
        <span className={`status-badge status-${request.isAccepted.toLowerCase()}`}>
         {request.isAccepted === 'WAITING' ? '대기 중' :
             request.isAccepted === 'ACCEPTED' ? '승인됨' : '거절됨'}
       </span>
      </div>
      <div className="card-content">
        <div className="info-row">
          <span>분야</span>
          <span>{request.field}</span>
        </div>
        <div className="info-row">
          <span>경력</span>
          <span>{request.career}년</span>
        </div>
        {request.isAccepted === 'REJECTED' && (
            <button
                onClick={() => onDelete(request.requestId)}
                className="delete-button"
            >
              삭제
            </button>
        )}
      </div>
    </div>
);

const MentorRequestPage = () => {
  const [mentorRequests, setMentorRequests] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const history = useHistory();

  useEffect(() => {
    checkRoleAndFetch();
  }, []);

  const validateToken = (token) => {
    if (!token) return { isValid: false, role: null };
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return { isValid: false, role: null };
      const payload = JSON.parse(atob(parts[1]));
      console.log('Token payload:', payload);
      return {
        isValid: !(payload.exp && payload.exp < Date.now() / 1000),
        role: payload.role || payload.Role || payload.userRole
      };
    } catch (error) {
      console.error('Token validation error:', error);
      return { isValid: false, role: null };
    }
  };

  const checkRoleAndFetch = async () => {
    const token = localStorage.getItem('jwtToken');
    const { isValid, role } = validateToken(token);

    console.log('Token validation:', { isValid, role });

    if (!isValid) {
      localStorage.removeItem('jwtToken');
      history.push('/login');
      return;
    }

    setUserRole(role);

    if (role === 'MENTEE') {
      await fetchMentorRequests();
    }

    setLoading(false);
  };

  const fetchMentorRequests = async () => {
    const token = localStorage.getItem('jwtToken');
    try {
      const response = await axios.get('/users/mentors', {
        headers: { Authorization: `Bearer ${token.trim()}` }
      });
      console.log('Mentor requests:', response.data.data);
      setMentorRequests(response.data.data || []);
    } catch (error) {
      console.error('Mentor requests error:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('jwtToken');
        history.push('/login');
      } else {
        setError('멘토 요청 정보를 불러오는 데 실패했습니다.');
      }
    }
  };

  const handleDelete = async (requestId) => {
    try {
      const token = localStorage.getItem('jwtToken');
      await axios.delete(`/users/mentors/${requestId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMentorRequests(prevRequests =>
          prevRequests.filter(request => request.requestId !== requestId)
      );
    } catch (error) {
      setError('삭제에 실패했습니다.');
      console.error('Delete error:', error);
    }
  };

  if (loading) return <div className="loading-spinner" />;

  if (userRole !== 'MENTEE') {
    return (
        <div className="mentor-request-container">
          <div className="info-message">
            멘토/관리자용 페이지 구현 예정입니다.
          </div>
        </div>
    );
  }

  return (
      <div className="mentor-request-container">
        <h2>멘토 요청 목록</h2>
        {error ? (
            <div className="error-message">{error}</div>
        ) : mentorRequests.length > 0 ? (
            <div className="card-grid">
              {mentorRequests.map((request, index) => (
                  <MentorRequestCard
                      key={index}
                      request={request}
                      onDelete={handleDelete}
                  />
              ))}
            </div>
        ) : (
            <div className="empty-message">멘토 요청이 없습니다.</div>
        )}
      </div>
  );
};

export default MentorRequestPage;