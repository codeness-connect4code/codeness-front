import React, { useEffect, useState } from "react";
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
  const paymentId = params.get("paymentId");

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.iamport.kr/js/iamport.payment-1.2.0.js";
    script.async = true;
    script.onload = () => {
      if (window.IMP) {
        window.IMP.init("imp46707766");
      }
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handlePayment = () => {
    if (!scheduleId || !paymentId) {
      alert("결제 데이터를 찾을 수 없습니다.");
      return;
    }

    const IMP = window.IMP;
    const paymentData = {
      pg: "html5_inicis",
      pay_method: "card",
      merchant_uid: `order_${new Date().getTime()}`,
      name: `멘토링 스케줄 (${scheduleId})`,
      amount: 1,
      buyer_email: "test@test.com",
      buyer_name: "구매자이름",
      buyer_tel: "010-1234-5678",
    };

    IMP.request_pay(paymentData, async (rsp) => {
      if (rsp.success) {
        try {
          await axios.post(`/mentoring/payments/${paymentId}/verify`, {
            mentoringScheduleId: scheduleId,
            impUid: rsp.imp_uid,
            pgTid: rsp.pg_tid,
            paymentCost: rsp.paid_amount,
            paymentCard: "신용카드",
          });
          alert("결제가 완료되었습니다!");
          history.push("/mentoring/success");
        } catch (error) {
          console.error("결제 검증 중 오류:", error);
          alert("결제 검증 중 문제가 발생했습니다.");
        }
      } else {
        alert(`결제가 실패하였습니다: ${rsp.error_msg}`);
        try {
          await axios.delete(`/mentoring/payments/${paymentId}`, {
            data: { impUid: rsp.imp_uid },
          });
          alert("결제 실패로 인해 삭제되었습니다.");
        } catch (error) {
          console.error("결제 삭제 중 오류:", error);
          alert("결제 삭제 중 문제가 발생했습니다.");
        }
      }
    });
  };

  return (
      <div className="payment-page">
        <h1>Mentoring Payment</h1>
        <div className="payment-details">
          <p><strong>Schedule:</strong> {mentoringDate} {mentoringTime}</p>
          <button className="pay-button" onClick={handlePayment} disabled={isLoading}>
            {isLoading ? "결제 진행 중..." : "결제하기"}
          </button>
          <button className="back-button" onClick={() => history.goBack()}>뒤로가기</button>
        </div>
      </div>
  );
};

export default MentoringPayment;
