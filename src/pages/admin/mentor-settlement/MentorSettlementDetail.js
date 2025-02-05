import React, { useEffect, useState } from "react";
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';

function MentorSettlementDetail() {
  const [settlementDetails, setSettlementDetails] = useState(null);
  const [settlementList, setSettlementList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { mentorId } = useParams();
  const history = useHistory();
  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    const fetchSettlementDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/admin/mentors/settlements/${mentorId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // 첫 번째 데이터를 정산 요약으로 설정
        setSettlementDetails(response.data.data[0]);
        setSettlementList(response.data.data);
        setLoading(false);
      } catch (error) {
        setError('정산 내역을 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    fetchSettlementDetails();
  }, [mentorId, token]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;
  if (!settlementDetails) return null;

  return (
      <div style={{ display: 'flex', maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
        <div style={{ flex: 1, marginRight: '20px', overflowY: 'auto', maxHeight: '600px' }}>
          <h3>정산 내역 관리</h3>
          {settlementList.map((item, index) => (
              <div
                  key={index}
                  style={{
                    border: '1px solid #e0e0e0',
                    padding: '10px',
                    marginBottom: '10px',
                    borderRadius: '5px'
                  }}
              >
                <p>정산 처리 - {item.mentorName} / {item.createAt.split('T')[0]} / {item.createAt.split('T')[1].substring(0,5)}</p>
              </div>
          ))}
        </div>

        <div style={{
          width: '300px',
          border: '1px solid #e0e0e0',
          padding: '20px',
          borderRadius: '5px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3>멘토 김코딩 정산내역</h3>
          <div>
            <p>총 정산 건수: {settlementDetails.count}건</p>
            <p>총 정산 수익: {settlementDetails.totalCost.toLocaleString()}원</p>
            <p>중개 수수료: {settlementDetails.charge.toLocaleString()}원</p>
            <p>최종 정산 금액: {settlementDetails.finalCost.toLocaleString()}원</p>
            <p>정산 계좌: {settlementDetails.account}</p>
          </div>
          <button
              style={{
                width: '100%',
                marginTop: '10px',
                padding: '10px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px'
              }}
          >
            정산 완료
          </button>
        </div>
      </div>
  );
}

export default MentorSettlementDetail;