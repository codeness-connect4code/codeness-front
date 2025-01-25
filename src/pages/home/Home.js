import React from 'react';
import MentorRecommendation from './MentorRecommendation';
import MainNewsList from '../news/MainNews';
import CompanyInfo from './CompanyInfo';
import MainPosts from './MainPosts';

function Home() {
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