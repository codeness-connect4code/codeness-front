import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom'; // v5에서 useHistory 사용
import axios from 'axios';
import MentorRecommendation from './MentorRecommendation';
import MainNewsList from '../news/MainNews';
import CompanyInfo from './CompanyInfo';
import MainPosts from './MainPosts';

function Home() {
  const history = useHistory();
  const location = useLocation();
  
  useEffect(() => {
    // URL에서 토큰 파라미터 확인 (소셜 로그인 리다이렉트)
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("jwtToken", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      // 로그인 후 루트('/')로 리디렉션
      history.replace("/"); // 페이지를 루트로 리디렉션
    }

    const savedToken = localStorage.getItem("jwtToken");
    // 추가적인 로직 처리

  }, [location, history]); // 의존성 배열에 location, history 추가

  return (
      <div>
        <MentorRecommendation />
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '40px',
          width: '90%',
          margin: '0 auto',
          padding: '20px',
          minHeight: '400px'
        }}>
          <div style={{ width: '100%' }}>
            <MainNewsList />
            <div style={{ marginTop: '40px' }}>
              <MainPosts />
            </div>
          </div>
          <div style={{ width: '100%' }}>
            <CompanyInfo />
          </div>
        </div>
      </div>
  );
}

export default Home;
