import { useHistory } from 'react-router-dom';

const CompanyInfo = () => {

    const history = useHistory();

    const handleMentorRequest = () => {
        history.push('/user/mentor');
    };

    return (
      <div className="company-container">
        <div>
            <h2>회사 소개</h2>
        </div>
        <div>
            <p>Our CodeNess Site is for EveryOne who wants</p>
            <p>to know developers each other!</p>
        </div>
        <div>
            <p>You can get much information about develop</p>
            <p>mento and menties!</p>
        </div>
        <div>
            <p>You can get much information about develop</p>
            <p>mento and menties!</p>
        </div>
        <div>
            <p>We hope you have good relationship</p>
            <p>throughout our site!</p>
        </div>
        <div>
        <button className="mentor-request-button" onClick={handleMentorRequest}>
            멘토 신청하러 가기
        </button>
        </div>
      </div>
    );
   };

   export default CompanyInfo;