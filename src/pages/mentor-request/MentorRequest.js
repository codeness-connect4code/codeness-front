import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/mypage/mentor-request/MentorRequest.css'

const MentorApplicationForm = () => {
  const [formData, setFormData] = useState({
    company: '',
    field: 'BACKEND',
    phoneNumber: '',
    position: '',
    career: '',
    companyEmail: '',
    multipartFile: null,
  });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    checkUserInfo();
  }, []);

  const checkUserInfo = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.get('/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const userData = response.data.data;
      if (!userData.field || !userData.region) {
        setShowModal(true);
      }
    } catch (error) {
      console.error('사용자 정보 조회 실패:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, multipartFile: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('jwtToken');
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      await axios.post('/users/mentors', data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('멘토 신청이 성공적으로 제출되었습니다.');
      setFormData({
        company: '',
        field: 'BACKEND',
        phoneNumber: '',
        position: '',
        career: '',
        companyEmail: '',
        multipartFile: null,
      });
    } catch (error) {
      console.error('멘토 신청 제출 중 오류:', error);
      alert('멘토 신청 제출 중 오류가 발생했습니다.');
    }
  };

  return (
      <>
        <form onSubmit={handleSubmit} className="mentor-form">
          <div className="form-group">
            <label htmlFor="company">회사명:</label>
            <input type="text" id="company" name="company" value={formData.company} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="field">분야:</label>
            <select id="field" name="field" value={formData.field} onChange={handleChange}>
              <option value="FRONTEND">프론트엔드</option>
              <option value="BACKEND">백엔드</option>
              <option value="FULLSTACK">풀스택</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="phoneNumber">전화번호:</label>
            <input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="position">직책:</label>
            <input type="text" id="position" name="position" value={formData.position} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="career">경력:</label>
            <input type="number" id="career" name="career" value={formData.career} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="companyEmail">회사 이메일:</label>
            <input type="email" id="companyEmail" name="companyEmail" value={formData.companyEmail} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="multipartFile">프로필 사진:</label>
            <input type="file" id="multipartFile" name="multipartFile" onChange={handleFileChange} required />
          </div>
          <button type="submit" className="submit-button">멘토 신청</button>
        </form>

        {showModal && (
            <div className="modal">
              <div className="modal-content">
                <h2>알림</h2>
                <p>멘토 신청을 위해서는 회원 정보에서 분야와 지역을 먼저 입력해주세요.</p>
                <div className="modal-buttons">
                  <button onClick={() => window.location.href = '/profile'}>회원정보 수정하기</button>
                  <button onClick={() => setShowModal(false)}>닫기</button>
                </div>
              </div>
            </div>
        )}
      </>
  );
};

export default MentorApplicationForm;