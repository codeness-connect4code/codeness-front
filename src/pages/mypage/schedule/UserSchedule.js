import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import '../../../styles/mypage/schedule/UserSchedule.css'

const UserSchedule = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(moment());
  const [userProvider, setUserProvider] = useState(null);
  const history = useHistory();

  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  useEffect(() => {
    checkUserProvider();
  }, []);

  useEffect(() => {
    if (userProvider === 'LOCAL') {
      // LOCAL 유저라면 소셜 로그인 유도
      setError('소셜 로그인을 해주세요.');
    } else if (userProvider) {
      fetchEvents();
    }
  }, [currentMonth, userProvider]);

  const checkUserProvider = async () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      history.push('/login');
      return;
    }

    try {
      const response = await axios.get('http://localhost:8080/users/provider', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data?.data) {
        setUserProvider(response.data.data);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        history.push('/login');
      } else {
        setError('구글 소셜 로그인이 필요한 서비스입니다.');
      }
    }
  };

  const fetchEvents = async () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      history.push('/login');
      return;
    }

    try {
      const startDate = currentMonth.startOf('month').format('YYYY-MM-DD');
      const endDate = currentMonth.endOf('month').format('YYYY-MM-DD');

      const response = await axios.get('http://localhost:8080/users/schedule', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          startDate,
          endDate
        }
      });

      if (response.data?.data) {
        setEvents(response.data.data);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        history.push('/login');
      } else {
        setError('일정을 불러오는데 실패했습니다.');
      }
    }
  };

  const handlePrevMonth = () => setCurrentMonth(currentMonth.clone().subtract(1, 'month'));
  const handleNextMonth = () => setCurrentMonth(currentMonth.clone().add(1, 'month'));

  const generateCalendar = () => {
    const startDay = currentMonth.clone().startOf('month').startOf('week');
    const endDay = currentMonth.clone().endOf('month').endOf('week');
    const days = [];
    let day = startDay.clone();

    while (day.isBefore(endDay)) {
      days.push(day.clone());
      day.add(1, 'day');
    }

    return days;
  };

  const handleLogin = () => {
    history.push('/login');
  };

  return (
      <div className="calendar-container">
        {/* 사용자 정보 로드 실패 또는 LOCAL 사용자인 경우의 에러 처리 */}
        {error && (
            <div className="error-container">
              <p>{error}</p>
              <button onClick={handleLogin}>로그인 페이지로 이동</button>
            </div>
        )}

        {userProvider === 'LOCAL' && (
            <div className="social-login-prompt">
              <p>소셜 로그인을 해주세요.</p>
              <button onClick={handleLogin}>로그인하기</button>
            </div>
        )}

        {userProvider && userProvider !== 'LOCAL' && (
            <>
              <div className="calendar-header">
                <div className="calendar-controls">
                  <button onClick={handlePrevMonth}>&lt;</button>
                  <h2 className="calendar-title">{currentMonth.format('YYYY년 MM월')}</h2>
                  <button onClick={handleNextMonth}>&gt;</button>
                </div>
              </div>

              <div className="calendar-grid">
                {weekDays.map(day => (
                    <div key={day} className="weekday">
                      {day}
                    </div>
                ))}

                {generateCalendar().map(date => {
                  const isCurrentMonth = date.month() === currentMonth.month();
                  const dayEvents = events.filter(event =>
                      moment(event.startTime).format('YYYY-MM-DD') === date.format('YYYY-MM-DD')
                  );

                  return (
                      <div key={date.format('YYYY-MM-DD')}
                           className={`day ${!isCurrentMonth ? 'other-month' : ''}`}>
                        <div className="day-number">{date.format('D')}</div>
                        <div className="event-container">
                          {dayEvents.map(event => (
                              <div key={event.id} className="event" title={event.summary}>
                                <div className="event-title">{event.title}</div>
                                <div className="event-summary">{event.summary}</div>
                                <div className="event-details">
                                  <p>{moment(event.startTime).format('YYYY-MM-DD HH:mm')} ~ {moment(event.endTime).format('HH:mm')}</p>
                                  {event.description && <p>{event.description}</p>}
                                </div>
                              </div>
                          ))}
                        </div>
                      </div>
                  );
                })}
              </div>
            </>
        )}
      </div>
  );
};

export default UserSchedule;