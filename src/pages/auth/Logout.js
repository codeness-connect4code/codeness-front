import React from 'react';
import { useHistory } from 'react-router-dom';

const Logout = () => {
  const history = useHistory();

  const handleLogout = () => {
    // JWT 토큰 제거
    localStorage.removeItem('jwtToken');

    // 선택적: 사용자 관련 기타 정보 제거
    localStorage.removeItem('userInfo');

    // 로그인 페이지로 리다이렉트
    history.push('/login');
  };

  return (
      <button onClick={handleLogout}>로그아웃</button>
  );
};

export default Logout;