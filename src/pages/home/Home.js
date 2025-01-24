import React from 'react';
import { useHistory } from 'react-router-dom';
import MentorRecommendation from './MentorRecommendation';

function Home() {
  const history = useHistory();

  const handleMentorRequest = () => {
    history.push('/user/mentor');
  };

  return (
      <div>
        <MentorRecommendation />
        <div className="update-button-container">
          <button className="mentor-request-button" onClick={handleMentorRequest}>
            멘토 신청하러 가기
          </button>
        </div>
      </div>
  );
}

export default Home;