import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // 수정된 부분: named import

const UserUpdate = () => {
  const history = useHistory();
  const [formData, setFormData] = useState({
    nickname: '',
    phoneNumber: '',
    region: '',
    field: 'FRONTEND',
    career: '',
    mbti: '',
    siteLink: '',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [provider, setProvider] = useState(''); // provider 상태 추가
  const [decodedToken, setDecodedToken] = useState(null); // decodedToken 상태 추가

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) throw new Error('토큰이 없습니다.');

      // JWT 토큰을 디코딩하여 provider 값을 확인
      const decoded = jwtDecode(token); // jwtDecode로 수정
      setDecodedToken(decoded); // decodedToken 상태에 디코딩된 값 저장
      setProvider(decoded.provider); // provider 값을 상태에 저장

      // API 호출: 구글 유저와 로컬 유저에 따라 다른 엔드포인트 사용
      const response = await fetch(decoded.provider === 'GOOGLE' ? '/google/users' : '/users', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setFormData((prevState) => ({
        ...prevState,
        ...data,
        career: data.career?.toString() || '', // 경력 데이터 처리
      }));
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('jwtToken');

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });
    if (profileImage) {
      formDataToSend.append('multipartFile', profileImage);
    }

    try {
      const response = await fetch(provider === 'GOOGLE' ? '/google/users' : '/users', {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: formDataToSend,
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      alert('사용자 정보가 성공적으로 업데이트되었습니다.');
    } catch (error) {
      console.error('Error updating user:', error);
      alert('사용자 정보 업데이트 중 오류가 발생했습니다.');
    }
  };

  return (
      <form onSubmit={handleSubmit}>
        {provider === 'GOOGLE' && (
            <div>
              <label htmlFor="name">이름:</label>
              <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
              />
            </div>
        )}
        <div>
          <label htmlFor="nickname">닉네임:</label>
          <input
              type="text"
              id="nickname"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="phoneNumber">전화번호:</label>
          <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="region">지역:</label>
          <input
              type="text"
              id="region"
              name="region"
              value={formData.region}
              onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="field">분야:</label>
          <select
              id="field"
              name="field"
              value={formData.field}
              onChange={handleChange}
          >
            <option value="FRONTEND">프론트엔드</option>
            <option value="BACKEND">백엔드</option>
          </select>
        </div>
        <div>
          <label htmlFor="career">경력:</label>
          <input
              type="number"
              id="career"
              name="career"
              value={formData.career}
              onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="mbti">MBTI:</label>
          <input
              type="text"
              id="mbti"
              name="mbti"
              value={formData.mbti}
              onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="siteLink">사이트 링크:</label>
          <input
              type="text"
              id="siteLink"
              name="siteLink"
              value={formData.siteLink}
              onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="profileImage">프로필 이미지:</label>
          <input
              type="file"
              id="profileImage"
              onChange={handleImageChange}
              accept="image/*"
          />
        </div>
        <div>
          <button type="button" onClick={() => history.push('/password-update')}>
            비밀번호 변경
          </button>
          <button type="submit">정보 수정</button>
        </div>
      </form>
  );
};

export default UserUpdate;
