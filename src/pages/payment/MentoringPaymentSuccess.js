import React from "react";
import { useLocation, useHistory } from "react-router-dom";
import "../../styles/payment/MentoringPaymentSuccess.css";

const MentoringPaymentSuccess = () => {
  const location = useLocation();
  const history = useHistory();

  // location.state에서 데이터 가져오기
  const { mentorNickname, mentoringDate, mentoringTime } = location.state || {};

  // 확인 버튼 클릭 시 마이페이지 이동 TODO : 추후 변경 예정 
  const handleConfirm = () => {
    history.push("/mypage/profile");
  };

  return (
      <div className="payment-success-page">
        <div className="success-message-container">
          <h1>결제 완료</h1>
          <p>멘토링 신청을 완료했습니다.</p>
          <p>
            <strong>멘토:</strong> {mentorNickname}
          </p>
          <p>
            <strong>멘토링 날짜:</strong> {mentoringDate}
          </p>
          <p>
            <strong>멘토링 시간:</strong> {mentoringTime}
          </p>
          <button className="confirm-button" onClick={handleConfirm}>
            확인
          </button>
        </div>
      </div>
  );
};

export default MentoringPaymentSuccess;
