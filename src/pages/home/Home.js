import React from 'react';
import { useHistory } from 'react-router-dom';

function Home() {
  const history = useHistory();

  const handleMentorRequest = () => {
    history.push('/user/mentor');
  };

  return (
      <div>
        <h1>Welcome to the Home Page</h1>
        <div className="update-button-container">
          <button className="mentor-request-button" onClick={handleMentorRequest}>
            멘토 신청하러 가기
          </button>
        </div>
      </div>
  );
}

export default Home;