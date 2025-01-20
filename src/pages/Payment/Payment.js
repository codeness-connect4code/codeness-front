import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

const Payment = () => {
  const [token, setToken] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [paymentId, setPaymentId] = useState(null);
  const [pgTid, setPgTid] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const loadIamportScript = () => {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://cdn.iamport.kr/js/iamport.payment-1.2.0.js";
        script.async = true;
        script.onload = () => {
          console.log("Iamport SDK 로드 완료");
          if (window.IMP) {
            window.IMP.init("imp46707766");
            console.log("IMP 초기화 완료");
            resolve();
          } else {
            reject(new Error("IMP 객체가 존재하지 않습니다."));
          }
        };
        script.onerror = () => reject(new Error("Iamport 스크립트 로드 실패"));
        document.head.appendChild(script);
      });
    };

    const jwtToken = localStorage.getItem("token");
    if (!jwtToken) {
      history.push("/login");
      return;
    }

    setToken(jwtToken);
    axios.defaults.headers.common["Authorization"] = jwtToken.startsWith(
      "Bearer "
    )
      ? jwtToken
      : `Bearer ${jwtToken}`;

    loadIamportScript()
      .then(() => console.log("아임포트 초기화 성공"))
      .catch((error) => {
        console.error("아임포트 로드 실패:", error);
        alert("결제 모듈 로드에 실패했습니다. 페이지를 새로고침 해주세요.");
      });

    return () => {
      const script = document.querySelector('script[src*="iamport"]');
      if (script) {
        script.remove();
      }
    };
  }, [history]);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await axios.get(
          "/mentoring/1/mentoring-schedule/empty-status"
        );
        setSchedules(response.data.data);
      } catch (error) {
        console.error("스케줄 데이터 가져오기 오류:", error);
      }
    };

    if (token) {
      fetchSchedules();
    }
  }, [token]);

  const handleApply = async (scheduleId) => {
    setIsLoading(true);
    try {
      console.log("요청 준비:", {
        token,
        scheduleId,
      });
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
      console.error(
        "주문 생성 요청 중 오류:",
        error.response?.data || error.message
      );
      alert("주문 생성 중 문제가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = () => {
    if (!selectedScheduleId) {
      alert("먼저 스케줄을 신청해주세요.");
      return;
    }

    if (!window.IMP) {
      alert("결제 모듈이 로드되지 않았습니다. 페이지를 새로고침 해주세요.");
      return;
    }

    console.log("결제 시작...", window.IMP);

    const paymentData = {
      pg: "html5_inicis",
      pay_method: "card",
      merchant_uid: `order_${new Date().getTime()}`,
      name: `멘토링 스케줄 (${selectedScheduleId})`,
      amount: 1,
    };

    window.IMP.request_pay(paymentData, async (rsp) => {
      console.log("결제 요청 응답:", rsp);
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
          console.error(
            "결제 검증 요청 중 오류:",
            error.response?.data || error.message
          );
          alert("결제 검증 중 문제가 발생했습니다.");
        }
      } else {
        alert(`결제가 실패하였습니다. 오류: ${rsp.error_msg}`);
      }
    });
  };

  const handleRefund = async () => {
    if (!paymentId) {
      alert("환불할 결제가 선택되지 않았습니다.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(`/payments/${paymentId}/refund`, {
        pgTid,
      });
      alert(`환불 완료: ${response.data.msg}`);
    } catch (error) {
      console.error(
        "환불 요청 중 오류:",
        error.response?.data || error.message
      );
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
                  {/* 신청 버튼 */}
                  <button
                    onClick={() => handleApply(schedule.id)}
                    disabled={isLoading || selectedScheduleId === schedule.id}
                  >
                    {isLoading && selectedScheduleId === schedule.id
                      ? "신청 중..."
                      : "신청"}
                  </button>

                  {/* 결제 버튼 */}
                  <button
                    onClick={handlePayment}
                    disabled={isLoading || selectedScheduleId !== schedule.id}
                  >
                    {isLoading && selectedScheduleId === schedule.id
                      ? "결제 중..."
                      : "결제하기"}
                  </button>

                  {/* 환불 버튼 */}
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
    </div>
  );
};

export default Payment;
