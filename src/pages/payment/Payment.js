import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import axios from "axios";

const Payment = () => {
  const [schedules, setSchedules] = useState([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [paymentId, setPaymentId] = useState(null);
  const [pgTid, setPgTid] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    // URL에서 토큰 파라미터 확인 (소셜 로그인 리다이렉트)
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("jwtToken", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      window.history.replaceState({}, document.title, "/payment");
    }

    const savedToken = localStorage.getItem("jwtToken");
    if (!savedToken) {
      history.push("/login");
      return;
    }

    // axios 기본 설정
    axios.defaults.baseURL = "http://localhost:8080";
    axios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;

    // Iamport SDK 로드
    const script = document.createElement("script");
    script.src = "https://cdn.iamport.kr/js/iamport.payment-1.2.0.js";
    script.async = true;
    script.onload = () => {
      if (window.IMP) {
        window.IMP.init("imp46707766");
        console.log("IMP 초기화 완료");
      }
    };
    document.head.appendChild(script);

    // 스케줄 데이터 가져오기
    const fetchSchedules = async () => {
      try {
        const response = await axios.get(
          "/mentoring/1/mentoring-schedule/empty-status"
        );
        console.log("스케줄 데이터:", response.data);
        setSchedules(response.data.data);
      } catch (error) {
        console.error("스케줄 데이터 가져오기 오류:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("jwtToken");
          history.push("/login");
        }
      }
    };

    fetchSchedules();

    return () => {
      const script = document.querySelector('script[src*="iamport"]');
      if (script) {
        script.remove();
      }
    };
  }, [history, location]);

  const handleApply = async (scheduleId) => {
    setIsLoading(true);
    try {
      console.log("요청 준비:", { scheduleId });
      const response = await axios.post("/mentoring/payments", {
        mentoringScheduleId: scheduleId,
        paymentCost: 1,
        paymentCard: "신용카드",
      });

      console.log("응답 데이터:", response.data);
      alert("주문이 생성되었습니다.");
      setPaymentId(response.data.data);
      setSelectedScheduleId(scheduleId);
    } catch (error) {
      console.error("주문 생성 요청 중 오류:", error);
      if (error.response?.status === 500) {
        if (error.response.data?.message?.includes("Duplicate")) {
          alert("이미 신청한 스케줄입니다.");
        } else {
          alert("주문 생성 중 서버 오류가 발생했습니다.");
        }
      } else {
        alert(
          "주문 생성 중 문제가 발생했습니다: " +
            (error.response?.data?.message || error.message)
        );
      }
      // 오류 발생 시 상태 초기화
      setSelectedScheduleId(null);
      setPaymentId(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = () => {
    if (!selectedScheduleId) {
      alert("먼저 스케줄을 신청해주세요.");
      return;
    }

    const IMP = window.IMP;
    if (!IMP) {
      alert("결제 모듈이 로드되지 않았습니다. 페이지를 새로고침 해주세요.");
      return;
    }

    const paymentData = {
      pg: "html5_inicis",
      pay_method: "card",
      merchant_uid: `order_${new Date().getTime()}`,
      name: `멘토링 스케줄 (${selectedScheduleId})`,
      amount: 1,
      buyer_email: "test@test.com",
      buyer_name: "구매자이름",
      buyer_tel: "010-1234-5678",
    };

    IMP.request_pay(paymentData, async (rsp) => {
      console.log("결제 응답:", rsp);
      if (rsp.success) {
        alert("결제가 완료되었습니다.");
        setPgTid(rsp.pg_tid);
        try {
          const response = await axios.post(
            `/mentoring/payments/${paymentId}/verify`,
            {
              mentoringScheduleId: selectedScheduleId,
              impUid: rsp.imp_uid,
              pgTid: rsp.pg_tid,
              paymentCost: rsp.paid_amount,
              paymentCard: "신용카드",
            }
          );
          alert(`결제 확인 완료: ${response.data.msg}`);
        } catch (error) {
          console.error("결제 검증 요청 중 오류:", error);
          alert("결제 검증 중 문제가 발생했습니다.");
        }
      } else {
        alert(`결제가 실패하였습니다. 오류: ${rsp.error_msg}`);
        try {
          await axios.delete(`/mentoring/payments/${paymentId}`, {
            data: { impUid: rsp.imp_uid },
          });
          alert("결제가 실패하여 삭제되었습니다.");
        } catch (error) {
          console.error("결제 삭제 요청 중 오류:", error);
          alert("결제 삭제 중 문제가 발생했습니다.");
        }
      }
    });
  };

  const handleRefund = async () => {
    if (!paymentId || !pgTid) {
      alert("환불할 결제가 선택되지 않았습니다.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(`/payments/${paymentId}/refund`, {
        pgTid,
      });
      alert(`환불 완료: ${response.data.msg}`);
      setPaymentId(null);
      setPgTid(null);
      setSelectedScheduleId(null);
    } catch (error) {
      console.error("환불 요청 중 오류:", error);
      alert("환불 요청 중 문제가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>멘토링 스케쥴 신청 및 결제</h1>
      <div className="schedule-list">
        <h2>유효한 스케쥴 목록</h2>
        {schedules.length > 0 ? (
          <ul>
            {schedules.map((schedule) => (
              <li key={schedule.id}>
                <span>
                  스케쥴: {schedule.date} {schedule.time}
                </span>
                <div>
                  <button
                    onClick={() => handleApply(schedule.id)}
                    disabled={isLoading || selectedScheduleId === schedule.id}
                  >
                    {isLoading && selectedScheduleId === schedule.id
                      ? "신청 중..."
                      : "신청"}
                  </button>
                  {selectedScheduleId === schedule.id && paymentId && (
                    <button onClick={handlePayment} disabled={isLoading}>
                      {isLoading ? "결제 중..." : "결제하기"}
                    </button>
                  )}
                  {pgTid && selectedScheduleId === schedule.id && (
                    <button onClick={handleRefund} disabled={isLoading}>
                      {isLoading ? "환불 중..." : "환불"}
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>유효한 스케쥴이 없습니다.</p>
        )}
      </div>
      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }

        h1 {
          text-align: center;
          color: #333;
        }

        .schedule-list {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        h2 {
          color: #666;
          margin-bottom: 20px;
        }

        ul {
          list-style: none;
          padding: 0;
        }

        li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          border-bottom: 1px solid #eee;
          margin-bottom: 10px;
        }

        li:last-child {
          border-bottom: none;
        }

        button {
          padding: 8px 16px;
          margin-left: 10px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        button:not(:disabled) {
          background-color: #007bff;
          color: white;
        }

        button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }

        button:not(:disabled):hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
};

export default Payment;
