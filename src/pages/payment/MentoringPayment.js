import React, { useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import axios from "axios";
import "../../styles/payment/MentoringPayment.css";

const MentoringPayment = () => {
  const location = useLocation();
  const history = useHistory();

  const [isLoading, setIsLoading] = useState(false);

  const params = new URLSearchParams(location.search);
  const mentoringDate = params.get("mentoringDate");
  const mentoringTime = params.get("mentoringTime");
  const scheduleId = params.get("scheduleId");

  const handlePayment = async () => {
    if (!scheduleId) {
      alert("스케줄 정보를 찾을 수 없습니다.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("/mentoring/payments", {
        mentoringScheduleId: scheduleId,
        paymentCost: 1,
        paymentCard: "신용카드",
      });
      alert("결제가 완료되었습니다!");
      history.push(`/mentoring/success`);
    } catch (error) {
      console.error("결제 요청 중 오류:", error);
      alert("결제 요청 중 문제가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="payment-page">
        <h1>Mentoring Payment</h1>
        <div className="payment-details">
          <p><strong>Schedule:</strong> {mentoringDate} {mentoringTime}</p>
          <button className="pay-button" onClick={handlePayment} disabled={isLoading}>
            {isLoading ? "Processing..." : "Pay Now"}
          </button>
          <button className="back-button" onClick={() => history.goBack()}>Go Back</button>
        </div>
      </div>
  );
};

export default MentoringPayment;
