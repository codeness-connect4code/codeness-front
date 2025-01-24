import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import "../../styles/payment/MentoringReservation.css";

const MentoringReservation = () => {
  const { mentoringPostId } = useParams();
  const history = useHistory();

  const [mentoringPost, setMentoringPost] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  useEffect(() => {
    const fetchMentoringPost = async () => {
      try {
        const response = await axios.get(`/mentoring/${mentoringPostId}`);
        setMentoringPost(response.data.data);
      } catch (error) {
        console.error("공고 데이터 가져오기 오류:", error);
      }
    };

    fetchMentoringPost();
  }, [mentoringPostId]);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await axios.get(
            `/mentoring/${mentoringPostId}/mentoring-schedule/empty-status`
        );
        const data = response.data.data || [];
        setSchedules(data);
      } catch (error) {
        console.error("스케줄 데이터 가져오기 오류:", error);
        setSchedules([]);
      }
    };

    fetchSchedules();
  }, [mentoringPostId]);

  const handleScheduleSelect = (schedule) => {
    setSelectedSchedule(schedule);
  };

  const handleBookNow = async () => {
    if (selectedSchedule) {
      try {
        const response = await axios.post("/mentoring/payments", {
          mentoringScheduleId: selectedSchedule.id,
          paymentCost: mentoringPost.price,
          paymentCard: "신용카드",
        });
        const paymentId = response.data.data;
        history.push(
            `/payment?mentoringDate=${selectedSchedule.mentoringDate}&mentoringTime=${selectedSchedule.mentoringTime}&scheduleId=${selectedSchedule.id}&paymentId=${paymentId}`
        );
      } catch (error) {
        console.error("결제 생성 중 오류:", error);
        alert("결제 생성 중 문제가 발생했습니다.");
      }
    } else {
      alert("스케줄을 선택해주세요.");
    }
  };

  if (!mentoringPost) return <div>Loading...</div>;

  return (
      <div className="mentoring-container">
        <div className="mentoring-card">
          <h2 className="mentoring-card-title">{mentoringPost?.title}</h2>
          <div className="mentoring-profile">
            <img
                src={mentoringPost?.mentorProfilePicture}
                alt="Mentor Profile"
                className="mentoring-profile-img"
            />
            <div className="mentoring-profile-details">
              <p className="mentor-name">{mentoringPost?.mentorNickname}</p>
              <p>{mentoringPost?.company}</p>
              <p>가격 : {mentoringPost?.price}원</p>
            </div>
          </div>

          <div className="mentoring-schedule">
            <label className="mentoring-schedule-label">결제 가능한 스케쥴</label>
            <ul className="mentoring-schedule-list">
              {schedules.map((schedule) => (
                  <li
                      key={schedule.id}
                      className={`mentoring-schedule-item ${
                          selectedSchedule?.id === schedule.id ? "selected" : ""
                      }`}
                      onClick={() => handleScheduleSelect(schedule)}
                  >
                    {schedule.mentoringDate} - {schedule.mentoringTime}
                  </li>
              ))}
            </ul>
          </div>

          {selectedSchedule && (
              <button onClick={handleBookNow} className="mentoring-button">
                결제하기
              </button>
          )}
        </div>
      </div>
  );
};

export default MentoringReservation;
