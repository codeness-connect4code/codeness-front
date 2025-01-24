import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import '../../../styles/admin/MentorRequest.css'

const MentorRequestList = () => {
  const [mentorRequests, setMentorRequests] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    fetchMentorRequests();
  }, []);

  const fetchMentorRequests = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.get('/admin/mentors/mentor-requests', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMentorRequests(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('멘토 요청 목록 조회 실패:', error);
      setError('멘토 요청 목록을 불러오는 데 실패했습니다.');
      setLoading(false);
    }
  };

  const handleCardClick = (mentorId) => {
    history.push(`/admin/mentor-request/${mentorId}`);
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
      <div className="mentor-request-container">
        <h2>멘토 신청 목록</h2>
        {mentorRequests.length > 0 ? (
            <div className="card-grid">
              {mentorRequests.map((request) => (
                  <div
                      key={request.mentorId}
                      className="mentor-card"
                      onClick={() => handleCardClick(request.mentorId)}
                  >
                    <div className="card-header">
                      <h3>{request.userName}</h3>
                      <span>{request.company}</span>
                    </div>
                    <div className="card-content">
                      <div>분야: {request.field}</div>
                      <div>경력: {request.career}년</div>
                      <div>신청일: {new Date(request.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
              ))}
            </div>
        ) : (
            <div>멘토 신청 내역이 없습니다.</div>
        )}
      </div>
  );
};

export default MentorRequestList;